const { staking } = require("../helper/staking");
const ADDRESSES = require("../helper/coreAssets.json");
const contractAbis = {
  readOraclePrice: "function read() view returns (int224 value, uint32 timestamp)",
  balanceOf: "function balanceOf(address) external view returns (uint256)",
  getPrice: "function answer() external view returns (uint256)",
  getTotalSupply: "function totalSupply() external view returns (uint256)",
  getTotalAssets: "function totalAssets() external view returns (uint256)",
  getVectorSharePrice: "function getVectorSharePrice() external view returns (uint256)",
  getMswEthPrice: "function exchangeRateToNative() external view returns (uint256)",
  getMswBalance: "function getAllEigeinPieCycleDepositAmounts() external view returns (uint256)",
  getUnderlyingPrice: "function getUnderlyingPrice(address cToken) view returns (uint256)",
  getUniswapPrice:
    "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 observationCardinalityNext, uint8 observationCardinalityNext)",
};

module.exports = {
  misrepresentedTokens: true,

  zklink: {
    tvl: async (api) => {
      const pufEth1x = {
        vault: "0xD06E74D03a98A085C6060C4148902d2048C2D458",
        reStakingToken: "0x1B49eCf1A8323Db4abf48b2F5EFaA33F7DdAB3FC",
      };

      await api.sumTokens({
        tokensAndOwners: [[pufEth1x.reStakingToken, pufEth1x.vault]],
      });
    },
  },

  mode: {
    tvl: async (api) => {
      const lendingMode = {
        eth: "0x89C133c5e8eD4Cd7CD87A1A00c1e70c13A29b90B",
      };
      await api.sumTokens({
        tokensAndOwners: [[ADDRESSES.mode.WETH, lendingMode.eth]],
      });

      const ezETH = {
        vault: "0x497eB27Ca1ed7566653edf811b03d6418a03FC9d",
        reStakingToken: ADDRESSES.blast.ezETH,
        oracle: "0x2BAF3A2B667A5027a83101d218A9e8B73577F117", //Renzo
        oracleToken: "0x59e710215d45f584f44c0fee83da6d43d762d857",
      };

      const ezETH1x = {
        vault: "0x9c96d0Cc5341654167ee35DB4F288ae523fe8779",
        reStakingToken: ADDRESSES.blast.ezETH,
        oracle: "0x2BAF3A2B667A5027a83101d218A9e8B73577F117", //Renzo
        oracleToken: "0x59e710215d45f584f44c0fee83da6d43d762d857",
      };

      const balOfezETH = await api.call({
        abi: contractAbis.balanceOf,
        target: ezETH.reStakingToken,
        params: [ezETH.vault],
      });

      const balOfezETH1x = await api.call({
        abi: contractAbis.balanceOf,
        target: ezETH.reStakingToken,
        params: [ezETH1x.vault],
      });

      const priceOfezETH = await api.call({
        target: ezETH.oracle,
        abi: contractAbis.getUnderlyingPrice,
        params: [ezETH.oracleToken],
      });

      const ezETHBalInETH = (balOfezETH * priceOfezETH) / 1e18;

      const ezETH1xBalInETH = (balOfezETH1x * priceOfezETH) / 1e18;

      api.add(ADDRESSES.mode.WETH, ezETHBalInETH);
      api.add(ADDRESSES.mode.WETH, ezETH1xBalInETH);
    },
  },

  ethereum: {
    tvl: async (api) => {
      const lendingMain = {
        eth: "0xdeF3AA48bad043e53207d359dcDFdE46F50b6C02", //ETH
        sUSD: "0x7c2a7009ffE52a69a8C877b47B07D5dB59C0e3b3", // Not lending pool, staking pool
      };
      const tokensAndOwners = [
        [ADDRESSES.ethereum.WETH, lendingMain.eth],
        [ADDRESSES.ethereum.sUSDe, lendingMain.sUSD],
      ];

      const eETH = {
        vault: "0xE543eBa28a3793d5ae747A2164A306DB1767cDAe",
        reStakingToken: "0xeA1A6307D9b18F8d1cbf1c3Dd6aad8416C06a221",
        oracle: "0xb09cbB6Aa95A004F9aeE4349DF431aF5ad03ECe4",
      };
      tokensAndOwners.push([eETH.reStakingToken, eETH.vault]);

      // leverage users
      const ezETH = {
        vault: "0x32a0ce2bDfc37eE606aB905b4f9fC286049A774f",
        reStakingToken: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
        oracle: "0x28c1576eb118f2Ccd02eF2e6Dbd732F5C8D2e86B", //Renzo
      };

      const weETH = {
        vault: "0x5e0a74cb0F74D57F9d69914575b972ba6A14e27c",
        reStakingToken: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
        oracle: "0x6869f88582D049B9968A0Ef7bFCA2609D5F0123B",
      };

      const rsETH = {
        vault: "0xEc69AaC84D3081aA6F4636C5DBD3D7C2c2F42a9C",
        reStakingToken: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
        oracle: "0x1250BbACBC9302D2C0B5F4E48cc9907a6C1Aa67D",
      };

      const ezETH1x = {
        vault: "0xa9A57D0824a613d181e0323b0cA85fBD4E27160B",
        reStakingToken: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
        oracle: "0x28c1576eb118f2Ccd02eF2e6Dbd732F5C8D2e86B", //Renzo
      };

      const weETH1x = {
        vault: "0x9320AB04E319018842BD59e2817054d19850Abc0",
        reStakingToken: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
        oracle: "0x6869f88582D049B9968A0Ef7bFCA2609D5F0123B",
      };

      const rsETH1x = {
        vault: "0x15A692f5986e9B3cd0aF02D0f5c78A37CB120843",
        reStakingToken: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
        oracle: "0x1250BbACBC9302D2C0B5F4E48cc9907a6C1Aa67D",
      };

      const bedRockETH = {
        vault: "0x291B812D84707EEB256D618C4c333Ff5F451321F",
        reStakingToken: "0xF1376bceF0f78459C0Ed0ba5ddce976F1ddF51F4",
        oracle: "0x1bEB65b15689cCAeb5dA191c9fd5F94513923Cab",
      };

      const bedRockETH1x = {
        vault: "0x8E2afd8E9C64097b9908c453fCd939fe81b102AF",
        reStakingToken: "0xF1376bceF0f78459C0Ed0ba5ddce976F1ddF51F4",
        oracle: "0x1bEB65b15689cCAeb5dA191c9fd5F94513923Cab",
      };

      const svETH = {
        vault: "0xaF33b6372354149c33893B6fA6959Be0607D53dE",
        reStakingToken: "0x6733F0283711F225A447e759D859a70b0c0Fd2bC",
        oracle: "svETH",
      };

      const svETH1x = {
        vault: "0x060Feab7904378e2A487974e7Ba98251aD65247F",
        reStakingToken: "0x6733F0283711F225A447e759D859a70b0c0Fd2bC",
        oracle: "svETH",
      };

      const mswETH = {
        vault: "0x7c505E03460aEF7FE88e218CC5fcEeCCcA4C4394",
        reStakingToken: "0x32bd822d615A3658A68b6fDD30c2fcb2C996D678",
      };

      const mswETH1x = {
        vault: "0x1100195fbdA2f22AA6f394E6C65f168779Fe572c",
        reStakingToken: "0x32bd822d615A3658A68b6fDD30c2fcb2C996D678",
      };
      const strategies = [
        ezETH,
        weETH,
        rsETH,
        ezETH1x,
        weETH1x,
        rsETH1x,
        bedRockETH,
        bedRockETH1x,
        svETH1x,
        svETH,
        // mswETH, @note require another function to return the balance of
        mswETH1x,
      ];
      strategies.forEach(({ vault, reStakingToken }) => tokensAndOwners.push([reStakingToken, vault]));

      //  mswETH
      const mswETHBal = await api.call({
        abi: contractAbis.getMswBalance,
        target: mswETH.vault,
      });

      api.add(mswETH.reStakingToken, mswETHBal);

      //new strats on pendle v2
      const pTweETH = {
        vault: "0xE9E2087CD1179378C847C1f3B73CCA929e3deb95",
        pendleAddress: "0xc69Ad9baB1dEE23F4605a82b3354F8E40d1E5966",
      };

      const pTezETH = {
        vault: "0x679EB9b7C57d9B98684034CDAfC2F4a72ABfEBD6",
        pendleAddress: "0xeee8aed1957ca1545a0508afb51b53cca7e3c0d1",
      };

      const pTsETH = {
        vault: "0x72Da018b1C7FAACEAa141DEc753F1fFe88c493AD",
        pendleAddress: "0xb05cabcd99cf9a73b19805edefc5f67ca5d1895e",
      };

      const tokensAndOwners2 = [pTweETH, pTezETH, pTsETH].map((i) => [i.pendleAddress, i.vault]);
      tokensAndOwners.push(...tokensAndOwners2);
      await api.sumTokens({ tokensAndOwners });
    },
    staking: staking("0x296281cC6EB049F33aB278D946F18d9cacCFcfB5", "0x2BE056e595110B30ddd5eaF674BdAC54615307d9"),
  },
  //-----------------------------------------------------------------------//

  arbitrum: {
    tvl: async (api) => {
      //lending
      const lendingArb = {
        usdc_e: "0xa2e4cab1F6f9f1163bCe937517f1935BEc4a0A7c",
        usdt: "0xeb0b9B5FFb763dD69440565F63c67f9695B7C3dA",
        arb: "0x529f94bcd37896b6a38452497C62b2F0a8217517",
        wstETH: "0x521A8Ca3baF3d7677ddCC091eD91D969D4AfcfF8",
        eth: "0x97801654D2048E639043c77b16Bc906541B3490a",
        usdc: "0xd3E1BDe4b4163c86B9b7668dE8Ae7618720dCa93",
      };

      await api.sumTokens({
        tokensAndOwners: [
          [ADDRESSES.arbitrum.USDC, lendingArb.usdc_e],
          [ADDRESSES.arbitrum.USDT, lendingArb.usdt],
          [ADDRESSES.arbitrum.WSTETH, lendingArb.wstETH],
          [ADDRESSES.arbitrum.WETH, lendingArb.eth],
          [ADDRESSES.arbitrum.ARB, lendingArb.arb],
          [ADDRESSES.arbitrum.USDC_CIRCLE, lendingArb.usdc],
        ],
      });

      // leverage users
      const ezETH = {
        vault: "0x6295248F578bFA9c057a3e1182BED27121530E7A",
        reStakingToken: ADDRESSES.blast.ezETH,
        oracle: "0x28c1576eb118f2Ccd02eF2e6Dbd732F5C8D2e86B", //Renzo
      };

      const weETH = {
        vault: "0xb8Cfb3406aBE78a2C836DCe69608e9cD80a78301",
        reStakingToken: "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe",
        oracle: "0x6869f88582D049B9968A0Ef7bFCA2609D5F0123B",
      };

      const rsETH = {
        vault: "0x65E7C3C88806FF010BB197B2577cCddA9704fA2F",
        reStakingToken: "0x4186BFC76E2E237523CBC30FD220FE055156b41F",
        oracle: "0x1250BbACBC9302D2C0B5F4E48cc9907a6C1Aa67D",
      };

      const ezETH1x = {
        vault: "0x0bAc1a3D569c16D8AD9D3aB37f61dAF18DCfF781" /*vault*/,
        reStakingToken: ADDRESSES.blast.ezETH /*reStakingToken*/,
        oracle: "0x28c1576eb118f2Ccd02eF2e6Dbd732F5C8D2e86B" /*oracle*/,
      };
      const weETH1x = {
        vault: "0xF528B8EA22a17000e49a914658d7E0F7d982803e" /*vault*/,
        reStakingToken: "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe" /*reStakingToken*/,
        oracle: "0x6869f88582D049B9968A0Ef7bFCA2609D5F0123B" /*oracle*/,
      };

      const rsETH1x = {
        vault: "0xe929BF8368171a76D4A828ee2cD4A50CcE31d203" /*vault*/,
        reStakingToken: "0x4186BFC76E2E237523CBC30FD220FE055156b41F" /*reStakingToken*/,
        oracle: "0x1250BbACBC9302D2C0B5F4E48cc9907a6C1Aa67D",
      };

      const strategies = [ezETH, weETH, rsETH, ezETH1x, weETH1x, rsETH1x];

      for (const strategy of strategies) {
        const bal = await api.call({
          abi: contractAbis.balanceOf,
          target: strategy.reStakingToken,
          params: [strategy.vault],
        });

        const lrETHPriceInETH = await api.call({
          target: strategy.oracle,
          abi: contractAbis.readOraclePrice,
        });

        const balInETH = (bal * lrETHPriceInETH.value) / 1e18;

        api.add(ADDRESSES.arbitrum.WETH, balInETH);
      }
    },
  },
};
