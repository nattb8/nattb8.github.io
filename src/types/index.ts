import { Dispatch, SetStateAction } from 'react'
import { IMXProvider } from '@imtbl/provider'

export enum EnvironmentNames {
  Sandbox = "sandbox",
  Production = "production",
}

export interface EnvironmentPropsType {
  disabled: boolean
}

export interface WorkflowProps {
  setUser: Dispatch<SetStateAction<any>>
  setMsg: Dispatch<SetStateAction<string[]>>
  wallet: string
  setWallet: Dispatch<SetStateAction<string>>
}

export interface MessageProps {
  messages: string[]
}

export interface StatusProps {
  user: any
  wallet: string
}

export interface OAuthDetailProps {
  user: any
}

export interface WalletDetailProps {
  wallet: string
}

export interface ToggleThemeProps {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
}

export interface BulkTransferProps {
  showBulkTransfer: boolean
  setShowBulkTransfer: Dispatch<SetStateAction<boolean>>
  provider: IMXProvider | null
  setMsg: Dispatch<SetStateAction<string[]>>
  wallet: string
}

export interface TransferProps {
  showTransfer: boolean
  setShowTransfer: Dispatch<SetStateAction<boolean>>
  provider: IMXProvider | null
  setMsg: Dispatch<SetStateAction<string[]>>
  wallet: string
}

export interface TradeProps {
  wallet: string
  showTrade: boolean
  setShowTrade: Dispatch<SetStateAction<boolean>>
  provider: IMXProvider | null
  setMsg: Dispatch<SetStateAction<string[]>>
}

export interface OrderProps {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  imxProvider: IMXProvider | null
  wallet: string
  setMsg: Dispatch<SetStateAction<string[]>>
}
