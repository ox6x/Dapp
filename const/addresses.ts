// const/addresses.ts
export const ADDRESSES = {
  FARMER: '0xf773A055Ec0Ab4D1404dBf61178f7dA7D769C44f',
  TOOLS_0: '0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179',
  REWARDS_0: '0x0Ad1149eec66A20cB69D114Aec704626C22b7852',
  STAKING_0: '0x8fCE5853B5228093Ab14df76a5a87e60971de989',
  TOOLS_1: '0xf747821D7A019B0C8c11824a141D2EA6De89cA34',
  REWARDS_1: '0x9db1cB30F01074e22cd3D6e92A08C6cB678Ab072',
  STAKING_1: '0x0925c9585398193d1c3327dcd66a69354273DeBF',
};

export function addAddresses(index: number, addresses: { tools: string, rewards: string, staking: string }) {
  ADDRESSES[`TOOLS_${index}`] = addresses.tools;
  ADDRESSES[`REWARDS_${index}`] = addresses.rewards;
  ADDRESSES[`STAKING_${index}`] = addresses.staking;
}