// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedXProductRegistry {
    struct Product {
        string productId;
        string name;
        string sku;
        string batchNumber;
        string category;
        uint256 quantity;
        uint256 expiryTimestamp;
        address addedBy;
        string addedByRole;
        uint256 timestamp;
    }

    struct ShipmentEvent {
        string eventType;
        string shipmentId;
        string fromEntity;
        string toEntity;
        address actor;
        string actorRole;
        uint256 timestamp;
    }

    mapping(string => Product) private products;
    mapping(string => bool) private productExists;
    string[] private productIdList;

    mapping(string => ShipmentEvent[]) private shipmentEvents;

    event ProductRegistered(
        string indexed productId,
        string name,
        string sku,
        address indexed addedBy,
        string addedByRole,
        uint256 timestamp
    );

    event ShipmentDispatched(
        string indexed shipmentId,
        string fromEntity,
        string toEntity,
        address indexed actor,
        string actorRole,
        uint256 timestamp
    );

    event ShipmentReceived(
        string indexed shipmentId,
        string fromEntity,
        string toEntity,
        address indexed actor,
        string actorRole,
        uint256 timestamp
    );

    function registerProduct(
        string calldata productId,
        string calldata name,
        string calldata sku,
        string calldata batchNumber,
        string calldata category,
        uint256 quantity,
        uint256 expiryTimestamp,
        string calldata role
    ) external {
        require(!productExists[productId], "Product already registered on-chain");

        products[productId] = Product({
            productId: productId,
            name: name,
            sku: sku,
            batchNumber: batchNumber,
            category: category,
            quantity: quantity,
            expiryTimestamp: expiryTimestamp,
            addedBy: msg.sender,
            addedByRole: role,
            timestamp: block.timestamp
        });

        productExists[productId] = true;
        productIdList.push(productId);

        emit ProductRegistered(productId, name, sku, msg.sender, role, block.timestamp);
    }

    function recordDispatch(
        string calldata shipmentId,
        string calldata fromEntity,
        string calldata toEntity,
        string calldata actorRole
    ) external {
        shipmentEvents[shipmentId].push(ShipmentEvent({
            eventType: "dispatched",
            shipmentId: shipmentId,
            fromEntity: fromEntity,
            toEntity: toEntity,
            actor: msg.sender,
            actorRole: actorRole,
            timestamp: block.timestamp
        }));

        emit ShipmentDispatched(shipmentId, fromEntity, toEntity, msg.sender, actorRole, block.timestamp);
    }

    function recordReceive(
        string calldata shipmentId,
        string calldata fromEntity,
        string calldata toEntity,
        string calldata actorRole
    ) external {
        shipmentEvents[shipmentId].push(ShipmentEvent({
            eventType: "received",
            shipmentId: shipmentId,
            fromEntity: fromEntity,
            toEntity: toEntity,
            actor: msg.sender,
            actorRole: actorRole,
            timestamp: block.timestamp
        }));

        emit ShipmentReceived(shipmentId, fromEntity, toEntity, msg.sender, actorRole, block.timestamp);
    }

    function getProduct(string calldata productId) external view returns (Product memory) {
        require(productExists[productId], "Product not found");
        return products[productId];
    }

    function isRegistered(string calldata productId) external view returns (bool) {
        return productExists[productId];
    }

    function getProductCount() external view returns (uint256) {
        return productIdList.length;
    }

    function getShipmentEvents(string calldata shipmentId) external view returns (ShipmentEvent[] memory) {
        return shipmentEvents[shipmentId];
    }
}
