FAssetsSettings – Read Lot Size & Asset Decimals from Flare Asset Manager

This contract provides a simple interface to retrieve important FAssets configuration values — specifically lotSizeAMG and assetDecimals — from the Flare AssetManager contract via the Flare Contract Registry.

These values help developers understand the minimum trade unit and decimal precision for an FAsset (e.g., FXRP).

📌 Features

Fetches the lot size of the FAsset in AMG units.

Fetches the asset’s decimal precision.

Uses the official Flare Contract Registry.

Reads settings directly from the AssetManager contract.

Fully on-chain, no need for external calls.

📁 Contract Overview
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// 1. Import the Flare Contract Registry
import {ContractRegistry} from "flare-periphery-contracts-fassets-test/coston2/ContractRegistry.sol";

// 2. Import the AssetManager interface
import {IAssetManager} from "flare-periphery-contracts-fassets-test/coston2/IAssetManager.sol";

// 3. Contract for accessing FAssets settings from the asset manager
contract FAssetsSettings {

    /// @notice Fetches the lot size and asset decimal configuration for FXRP
    /// @return lotSizeAMG The minimum tradeable lot size expressed in AMG units
    /// @return assetDecimals The number of decimals used by the FAsset
    function getLotSize()
        public
        view
        returns (uint64 lotSizeAMG, uint8 assetDecimals)
    {
        // 5. Get the AssetManager contract from the Flare Contract Registry
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();

        // 6. Retrieve configuration from the AssetManager
        lotSizeAMG = assetManager.getSettings().lotSizeAMG;
        assetDecimals = assetManager.getSettings().assetDecimals;

        return (lotSizeAMG, assetDecimals);
    }
}
<img width="1346" height="628" alt="image" src="https://github.com/user-attachments/assets/15aea976-4b8f-4a16-9c02-513056bfd65f" />


📘 What Are These Values?
🔹 lotSizeAMG

The smallest amount of the asset that can be redeemed or minted.

Defined in AMG units (Asset-Minted-Granularity).

Controls the minimum operational granularity for FAssets.

🔹 assetDecimals

The decimal precision used by the FAsset (similar to ERC-20 decimals).

Important when converting between AMG and the token’s UI representation.

For more details, see the official docs:
FAssets Operation Parameters
https://dev.flare.network/fassets/operational-parameters
