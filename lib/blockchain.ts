"use client"

import { BrowserProvider, Contract, parseUnits } from "ethers"
import { MEDX_CONTRACT_ABI, MEDX_CONTRACT_BYTECODE, SEPOLIA_CHAIN_ID } from "./contract-abi"
import type { Product } from "./types"

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void
      isMetaMask?: boolean
    }
  }
}

export function hasMetaMask(): boolean {
  return typeof window !== "undefined" && !!window.ethereum
}

export async function getProvider(): Promise<BrowserProvider> {
  if (!window.ethereum) throw new Error("MetaMask not found. Please install MetaMask.")
  return new BrowserProvider(window.ethereum)
}

export async function ensureSepoliaNetwork(): Promise<void> {
  if (!window.ethereum) throw new Error("MetaMask not found.")
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" }) as string
  const chainId = parseInt(chainIdHex, 16)
  if (chainId !== SEPOLIA_CHAIN_ID) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    })
  }
}

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) throw new Error("MetaMask not found. Please install MetaMask.")
  await ensureSepoliaNetwork()
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  }) as string[]
  if (!accounts || accounts.length === 0) throw new Error("No accounts found.")
  return accounts[0]
}

export async function getCurrentAccount(): Promise<string | null> {
  if (!window.ethereum) return null
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[]
    return accounts?.[0] ?? null
  } catch {
    return null
  }
}

export interface BlockchainProductResult {
  txHash: string
  blockNumber: number
}

export async function registerProductOnChain(
  product: Product,
  role: string
): Promise<BlockchainProductResult> {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  if (!contractAddress) {
    throw new Error("Contract not deployed yet. Run: npx hardhat run scripts/deploy.js --network sepolia")
  }

  await ensureSepoliaNetwork()
  const provider = await getProvider()
  const signer = await provider.getSigner()
  const contract = new Contract(contractAddress, MEDX_CONTRACT_ABI, signer)

  const expiryTimestamp = product.expiryDate
    ? BigInt(Math.floor(new Date(product.expiryDate).getTime() / 1000))
    : BigInt(0)

  const tx = await (contract as Contract & {
    registerProduct: (
      productId: string,
      name: string,
      sku: string,
      batchNumber: string,
      category: string,
      quantity: bigint,
      expiryTimestamp: bigint,
      role: string
    ) => Promise<{ hash: string; wait: () => Promise<{ blockNumber: number }> }>
  }).registerProduct(
    product.id,
    product.name,
    product.sku,
    product.batchNumber,
    product.category,
    BigInt(product.quantity),
    expiryTimestamp,
    role
  )

  const receipt = await tx.wait()
  return {
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
  }
}

export async function recordDispatchOnChain(
  shipmentId: string,
  fromEntity: string,
  toEntity: string,
  role: string
): Promise<BlockchainProductResult> {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  if (!contractAddress) throw new Error("Contract not deployed.")

  await ensureSepoliaNetwork()
  const provider = await getProvider()
  const signer = await provider.getSigner()
  const contract = new Contract(contractAddress, MEDX_CONTRACT_ABI, signer)

  const tx = await (contract as Contract & {
    recordDispatch: (
      shipmentId: string,
      fromEntity: string,
      toEntity: string,
      actorRole: string
    ) => Promise<{ hash: string; wait: () => Promise<{ blockNumber: number }> }>
  }).recordDispatch(shipmentId, fromEntity, toEntity, role)

  const receipt = await tx.wait()
  return { txHash: tx.hash, blockNumber: receipt.blockNumber }
}

export async function recordReceiveOnChain(
  shipmentId: string,
  fromEntity: string,
  toEntity: string,
  role: string
): Promise<BlockchainProductResult> {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  if (!contractAddress) throw new Error("Contract not deployed.")

  await ensureSepoliaNetwork()
  const provider = await getProvider()
  const signer = await provider.getSigner()
  const contract = new Contract(contractAddress, MEDX_CONTRACT_ABI, signer)

  const tx = await (contract as Contract & {
    recordReceive: (
      shipmentId: string,
      fromEntity: string,
      toEntity: string,
      actorRole: string
    ) => Promise<{ hash: string; wait: () => Promise<{ blockNumber: number }> }>
  }).recordReceive(shipmentId, fromEntity, toEntity, role)

  const receipt = await tx.wait()
  return { txHash: tx.hash, blockNumber: receipt.blockNumber }
}

export async function deployContract(): Promise<string> {
  const provider = await getProvider()
  const signer = await provider.getSigner()
  const factory = {
    abi: MEDX_CONTRACT_ABI,
    bytecode: MEDX_CONTRACT_BYTECODE,
  }

  const contract = new Contract(factory.bytecode, factory.abi, signer)
  const deployTx = await signer.sendTransaction({
    data: MEDX_CONTRACT_BYTECODE,
  })
  const receipt = await deployTx.wait()
  return receipt?.contractAddress ?? ""
}

export function getEtherscanUrl(txHash: string): string {
  return `https://sepolia.etherscan.io/tx/${txHash}`
}

export function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
