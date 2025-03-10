import { BigInt, Address, BigDecimal, TypedMap } from '@graphprotocol/graph-ts'

export const ZERO_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

// BigInt constants
export const ZERO_BI          = BigInt.zero()
export const ONE_BI           = BigInt.fromI32(1)
export const TWO_BI           = BigInt.fromI32(2)
export const TEN_BI           = BigInt.fromI32(10)
export const ONE_PERCENT_BI   = BigInt.fromString("10000000000000000") // 0.01 * 1e18
export const THREE_PERCENT_BI = BigInt.fromString("30000000000000000") // 0.03 * 1e18
export const FIVE_PERCENT_BI  = BigInt.fromString("50000000000000000") // 0.05 * 1e18
export const HALF_WAD_BI      = BigInt.fromString("500000000000000000")
export const ONE_WAD_BI       = BigInt.fromString("1000000000000000000")
export const NEG_ONE_BI       = BigInt.fromString('-1')

// BigDecimal constants
export const ZERO_BD = BigDecimal.zero()
export const EXP_18_BD = BigDecimal.fromString('1000000000000000000')
export const ONE_BD = BigDecimal.fromString('1')
export const NEG_ONE_BD = BigDecimal.fromString('-1')

// max price of the pool is 1_004_968_987.606512354182109771 * 1e18
export const MAX_PRICE = BigDecimal.fromString(`${1_004_968_987.606512354182109771}`)
export const MAX_PRICE_INDEX = 0
export const MAX_PRICE_BI = BigInt.fromString('1004968987606512354182109771')
export const MIN_BUCKET_INDEX = -3232;
export const MAX_BUCKET_INDEX = 4156;

// Pool addresses per network
export const poolInfoUtilsAddressTable = new TypedMap<string, Address>()
poolInfoUtilsAddressTable.set('mainnet', Address.fromString('0x30c5eF2997d6a882DE52c4ec01B6D0a5e5B4fAAE'))
poolInfoUtilsAddressTable.set('arbitrum-one', Address.fromString('0x8a7F5aFb7E3c3fD1f3Cc9D874b454b6De11EBbC9'))
poolInfoUtilsAddressTable.set('base', Address.fromString('0x97fa9b0909C238D170C1ab3B5c728A3a45BBEcBa'))
poolInfoUtilsAddressTable.set('matic', Address.fromString('0x519021054846cd3D9883359B593B5ED3058Fbe9f'))
poolInfoUtilsAddressTable.set('optimism', Address.fromString('0xdE6C8171b5b971F71C405631f4e0568ed8491aaC'))
poolInfoUtilsAddressTable.set('gnosis', Address.fromString('0x2baB4c287cF33a6eC373CFE152FdbA299B653F7D'))
poolInfoUtilsAddressTable.set('blast', Address.fromString('0x6aF0363e5d2ddab4471f31Fe2834145Aea1E55Ee'))
poolInfoUtilsAddressTable.set('goerli', Address.fromString('0xdE8D83e069F552fbf3EE5bF04E8C4fa53a097ee5'))
poolInfoUtilsAddressTable.set('ganache', Address.fromString('0x6c5c7fD98415168ada1930d44447790959097482'))
poolInfoUtilsAddressTable.set('filecoin', Address.fromString('0xCF7e3DABBaD8F0F3fdf1AE8a13C4be3872d06d56'))
poolInfoUtilsAddressTable.set('rari', Address.fromString('0xe85958CD5d59755470F6217aE9ee2Aa88eD02eE5'))
poolInfoUtilsAddressTable.set('linea', Address.fromString('0x3AFcEcB6A943746eccd72eb6801E534f8887eEA1'))
poolInfoUtilsAddressTable.set('avalanche', Address.fromString('0x9e407019C07b50e8D7C2d0E2F796C4eCb0F485b3'))
poolInfoUtilsAddressTable.set('bsc', Address.fromString('0x81557781862D3e0FF7559080C2A9AE1F08Ee8421'))
poolInfoUtilsAddressTable.set('hemi', Address.fromString('0xab57F608c37879360D622C32C6eF3BBa79AA667D'))

export const poolInfoUtilsMulticallAddressTable = new TypedMap<string, Address>()
poolInfoUtilsMulticallAddressTable.set('mainnet', Address.fromString('0xe4e553243264f2bF7C135F1eC3a8c09078731227'))
poolInfoUtilsMulticallAddressTable.set('arbitrum-one', Address.fromString('0xCcaf0542c78A3A5e55f99630a2B126A5BAA44FC3'))
poolInfoUtilsMulticallAddressTable.set('base', Address.fromString('0x249BCE105719Ae4183204371697c2743800C225d'))
poolInfoUtilsMulticallAddressTable.set('matic', Address.fromString('0xe6F4d9711121e5304b30aC2Aae57E3b085ad3c4d'))
poolInfoUtilsMulticallAddressTable.set('optimism', Address.fromString('0x33e5c2b41e915acFC268a4eaACC567f612f96601'))
poolInfoUtilsMulticallAddressTable.set('gnosis', Address.fromString('0x6A91429425Fb992A9cf300aD215e4469d0D1A75A'))
poolInfoUtilsMulticallAddressTable.set('blast', Address.fromString('0x1307d1670746E6cF6377844D350DD412Ef1684E5'))
poolInfoUtilsMulticallAddressTable.set('goerli', Address.fromString('0x63feF8659ECdC4F909ddFB55a8B701957115B906'))
poolInfoUtilsMulticallAddressTable.set('ganache', Address.fromString('0x6548dF23A854f72335902e58a1e59B50bb3f11F1'))
poolInfoUtilsMulticallAddressTable.set('filecoin', Address.fromString('0x82fba8E56F7D848B0Ee598f1449185b570d9B384'))
poolInfoUtilsMulticallAddressTable.set('rari', Address.fromString('0x26694369Dc342Cc0152A9c5975e10CF7EaB6163e'))
poolInfoUtilsMulticallAddressTable.set('linea', Address.fromString('0x38d55d1f2100dB1423C4907Aa907D47B4670d5EF'))
poolInfoUtilsMulticallAddressTable.set('avalanche', Address.fromString('0xD2b45DD650141a42fF948EC5B99D9E8DF6799B8f'))
poolInfoUtilsMulticallAddressTable.set('bsc', Address.fromString('0x56A08a72197f86625B0Ec64cA675b2b0568AD613'))
poolInfoUtilsMulticallAddressTable.set('hemi', Address.fromString('0x165fd403FC5709293B78E5A2C8f36A47187BBde0'))

export const positionManagerAddressTable = new TypedMap<string, Address>()
positionManagerAddressTable.set('mainnet', Address.fromString('0x87B0F458d8F1ACD28A83A748bFFbE24bD6B701B1'))
positionManagerAddressTable.set('arbitrum-one', Address.fromString('0x9A0BE971530Ed2B53597AC9155AC050ca1Bab7A3'))
positionManagerAddressTable.set('base', Address.fromString('0x59710a4149A27585f1841b5783ac704a08274e64'))
positionManagerAddressTable.set('matic', Address.fromString('0xb8DA113516bfb986B7b8738a76C136D1c16c5609'))
positionManagerAddressTable.set('optimism', Address.fromString('0x72bF565f2BdA43294C6cC2BfE17C7FaE5258F819'))
positionManagerAddressTable.set('gnosis', Address.fromString('0x173b32A07b41296909d7972421d63BAbA5160B37'))
positionManagerAddressTable.set('blast', Address.fromString('0x2475d80b7634aC8F891a5D00c8b56AA3a40E4Cf7'))
positionManagerAddressTable.set('goerli', Address.fromString('0x7b6C6917ACA28BA790837d41e5aA4A49c9Ad4570'))
positionManagerAddressTable.set('ganache', Address.fromString('0xdF7403003a16c49ebA5883bB5890d474794cea5a'))
positionManagerAddressTable.set('filecoin', Address.fromString('0x0cEfA3be6496B8Ab0A66B01aABEf05A5aE38221b'))
positionManagerAddressTable.set('rari', Address.fromString('0xBb4a65d74893C14060eDe747361D952f4F47DB6f'))
positionManagerAddressTable.set('linea', Address.fromString('0x083BDB49dBA6f5A225a20893e043220526DeCf54'))
positionManagerAddressTable.set('avalanche', Address.fromString('0x0bf183a32614b3Cd11C0268441D96047D05967e0'))
positionManagerAddressTable.set('bsc', Address.fromString('0x2DB531409656B4E1711EE89E6cB9A4a09aC0AAD7'))
positionManagerAddressTable.set('hemi', Address.fromString('0xCD7496b83D92c5e4F2CD9C90ccC5A5B3a578cF95'))

// GrantFund constants
export const CHALLENGE_PERIOD_LENGTH    = BigInt.fromI32(50400)
export const DISTRIBUTION_PERIOD_LENGTH = BigInt.fromI32(648000)
export const FUNDING_PERIOD_LENGTH      = BigInt.fromI32(72000)
export const SCREENING_PERIOD_LENGTH    = BigInt.fromI32(525600)
