const { ethers } = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("Deploying MedXProductRegistry to Sepolia...")

  const [deployer] = await ethers.getSigners()
  console.log("Deployer:", deployer.address)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log("Balance:", ethers.formatEther(balance), "ETH")

  if (balance === 0n) {
    console.error("\n❌ Deployer has 0 ETH. Get Sepolia ETH from https://sepoliafaucet.com")
    process.exit(1)
  }

  const Factory = await ethers.getContractFactory("MedXProductRegistry")
  const contract = await Factory.deploy()
  await contract.waitForDeployment()

  const address = await contract.getAddress()
  console.log("\n✅ MedXProductRegistry deployed!")
  console.log("   Address:", address)
  console.log("   Etherscan:", `https://sepolia.etherscan.io/address/${address}`)

  // ── Write address to .env.local ──────────────────────────────────────────
  const envPath = path.join(__dirname, "..", ".env.local")
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : ""

  if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
    )
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`
  }

  fs.writeFileSync(envPath, envContent)
  console.log("\n✅ Contract address saved to .env.local")

  // ── Read compiled artifact and rewrite contract-abi.ts ───────────────────
  const artifactPath = path.join(
    __dirname, "..", "artifacts", "contracts",
    "MedXProductRegistry.sol", "MedXProductRegistry.json"
  )

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"))
    const abi = JSON.stringify(artifact.abi, null, 2)
    const bytecode = artifact.bytecode

    const abiTs = `export const MEDX_CONTRACT_ABI = ${abi} as const

export const MEDX_CONTRACT_BYTECODE = "${bytecode}"

export const SEPOLIA_CHAIN_ID = 11155111

// Expected wallet addresses per role for the demo
export const ROLE_WALLETS: Record<string, string> = {
  supplier: "0x0b0eC0F1d07722c83fFB3059160354EfB1543fA2",
  distributor: "0xf7D0114FD13CaF8beCC81674DE5bAEc5282D9402",
  provider: "0x399aBCBcB26726eBeb5284a449B5C018496a10Ef",
  admin: "0x0B7192A04b242cDcE41DD7bA60d813e450967B3F",
}
`

    const abiTsPath = path.join(__dirname, "..", "lib", "contract-abi.ts")
    fs.writeFileSync(abiTsPath, abiTs)
    console.log("✅ lib/contract-abi.ts updated with new ABI and bytecode")
  } else {
    console.warn("⚠️  Artifact not found — lib/contract-abi.ts not updated. Run: npx hardhat compile first.")
  }

  console.log("\n👉 Restart your dev server (npm run dev) to pick up the new address.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
