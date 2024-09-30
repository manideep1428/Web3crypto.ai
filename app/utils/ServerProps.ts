import axios from "axios";

const Market_URL = "https://price-indexer.workers.madlads.com/?ids=solana,usd-coin,pyth-network,jito-governance-token,tether,bonk,helium,helium-mobile,bitcoin,ethereum,dogwifcoin,jupiter-exchange-solana,parcl,render-token,sharky-fi,tensor,wormhole,wen-4,cat-in-a-dogs-world,book-of-meme,raydium,hivemapper,kamino,drift-protocol,nyan,jeo-boden,habibi-sol,io,zeta,mother-iggy,shuffle-2,pepe,shiba-inu,chainlink,uniswap,ondo-finance,holograph,starknet,matic-network,fantom,mon-protocol,blur,worldcoin-wld,polyhedra-network,unagi-token,layerzero"

export async function getCrypto(): Promise<string[]> {
//    console.log("req came")
    const response = await axios.get(Market_URL);
    // console.log(response.data);
    return response.data;
}