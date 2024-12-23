type Version = 'V1' | 'V2';

let ADDRESS_VERSION: Version = (typeof window !== 'undefined' ? localStorage.getItem('ADDRESS_VERSION') as Version : 'V1') || 'V1';

const versionAddresses: Record<Version, { TOOLS_ADDRESS: string; REWARDS_ADDRESS: string; STAKING_ADDRESS: string }> = {
  V1: {
    TOOLS_ADDRESS: '0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179',
    REWARDS_ADDRESS: '0x0Ad1149eec66A20cB69D114Aec704626C22b7852',
    STAKING_ADDRESS: '0x8fCE5853B5228093Ab14df76a5a87e60971de989'
  },
  V2: {
    TOOLS_ADDRESS: '0xf747821D7A019B0C8c11824a141D2EA6De89cA34',
    REWARDS_ADDRESS: '0x9db1cB30F01074e22cd3D6e92A08C6cB678Ab072',
    STAKING_ADDRESS: '0x0925c9585398193d1c3327dcd66a69354273DeBF'
  }
};

export const FARMER_ADDRESS = '0xf773A055Ec0Ab4D1404dBf61178f7dA7D769C44f';
export const TOOLS_ADDRESS = versionAddresses[ADDRESS_VERSION].TOOLS_ADDRESS;
export const REWARDS_ADDRESS = versionAddresses[ADDRESS_VERSION].REWARDS_ADDRESS;
export const STAKING_ADDRESS = versionAddresses[ADDRESS_VERSION].STAKING_ADDRESS;

export const setVersion = (version: Version) => {
  ADDRESS_VERSION = version;
  if (typeof window !== 'undefined') {
    localStorage.setItem('ADDRESS_VERSION', version);
  }
};