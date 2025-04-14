// scripts/queries.js

import { gql } from "graphql-request";

export const GET_SONGS_AND_ARTISTS_BY_NAME = gql`
  query GetSongsAndArtistsByName($search: String!) {
    songUploadeds(where: { songName_contains: $search }) {
      id
      artist
      songName
      CID
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
    artistRegistereds(where: { metadataURI_contains: $search }) {
      id
      artist
      name
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Query per ottenere 10 canzoni scelti casualmente
export const GET_RANDOM_SONGS = gql`
  query GetRandomSongs {
    songUploadeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      artist
      songName
      CID
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Query per ottenere 10 artisti scelti casualmente
export const GET_RANDOM_ARTISTS = gql`
  query GetRandomArtists {
    artistRegistereds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      artist
      name
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Nuova: Query per cercare un artista tramite l'indirizzo "artist"
export const GET_ARTIST_BY_ADDRESS = gql`
  query GetArtistByAddress($artist: String!) {
    artistRegistereds(where: { artist: $artist }, first: 1) {
      id
      artist
      name
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_SONGS_BY_ARTIST = gql`
  query GetSongsByArtist($artist: String!) {
    songUploadeds(where: { artist: $artist }) {
      id
      artist
      songName
      CID
      metadataURI
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

