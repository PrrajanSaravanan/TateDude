// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductTracking {
    struct ProductTransaction {
        string producerName;     
        string location;
        uint256 price;
        uint256 transportCost;                
        uint256 timestamp;
    }

    struct Product {
        string productId;  // Unique QR ID
        ProductTransaction[] history;
        bool exists;
    }

    mapping(string => Product) private products;

    /// Event emitted when a product is created or updated
    event ProductCreated(string productId, string participantName);
    event ProductUpdated(string productId);

    /// Create a new product entry (first-time scan)
    function createProduct(
        string memory _productId,
        string memory _producerName,
        string memory _location,
        uint256 _price,
        uint256 _transportCost
    ) public {
        require(!products[_productId].exists, "Product already exists. Use updateProduct.");
        
        Product storage p = products[_productId];
        p.productId = _productId;
        p.exists = true;

        p.history.push(ProductTransaction({
            producerName: _producerName,
            location: _location,
            price: _price,
            transportCost: _transportCost,
            timestamp: block.timestamp
        }));

        emit ProductCreated(_productId, _producerName);
    }

    /// Add a new transaction for an existing product
    function updateProduct(
        string memory _productId,
        string memory _location,
        uint256 _price,
        uint256 _transportCost
    ) public {
        require(products[_productId].exists, "Product does not exist. Use createProduct first.");

        Product storage p = products[_productId];
        string memory producer = p.history[0].producerName;
        p.history.push(ProductTransaction({
            producerName: producer,
            location: _location,
            price: _price,
            transportCost: _transportCost,
            timestamp: block.timestamp
        }));

        emit ProductUpdated(_productId);
    }

    /// View full transaction history of a product
    function getProductHistory(string memory _productId) public view returns (ProductTransaction[] memory) {
        require(products[_productId].exists, "Product does not exist.");
        return products[_productId].history;
    }

    /// Optional: Check if a product exists (useful for frontend)
    function productExists(string memory _productId) public view returns (bool) {
        return products[_productId].exists;
    }
}
