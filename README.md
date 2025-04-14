# 🎵 SpotiChain - Decentralized Music Streaming

![Spotichain Logo](https://via.placeholder.com/150x50?text=SpotiChain)  
*A blockchain-powered music streaming platform*

## 🚀 Overview
SpotiChain is a **decentralized music streaming application** that leverages blockchain technology to create a transparent, fair, and artist-centric ecosystem. Unlike traditional platforms, SpotiChain stores music metadata on-chain and large files on IPFS, while using The Graph for efficient data querying.

## 🌐 Core Technologies

### 🔗 Blockchain Infrastructure
- **Smart Contracts**: Written in Solidity
- **Network**: Hardhat Testnet (EVM-compatible)
- **Key Features**:
  - Royalty distribution via smart contracts
  - Immutable ownership records
  - Transparent playcount tracking

### 📦 Decentralized Storage
- **IPFS** for storing:
  - Audio files (MP3/FLAC)
  - Album artwork
  - Artist metadata

### 🔍 Data Indexing
- **The Graph** subgraph for:
  - Fast song searches
  - Playlist generation
  - Analytics queries

## 🛠️ Architecture
```mermaid
graph TD
    A[User Frontend] --> B[The Graph API]
    A --> C[Hardhat Blockchain]
    A --> D[IPFS Gateway]
    B --> C
    B --> D
    C --> E[Smart Contracts]
    D --> F[IPFS Cluster]
