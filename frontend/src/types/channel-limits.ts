export interface KeyboardLimits {
  maxButtons?: number | null
  maxButtonTextLength?: number | null
  supportsUrlButtons?: boolean
  maxUrlButtons?: number
  supported?: boolean
}

export interface ChannelLimits {
  textMaxLength?: number | null
  standardKeyboard?: KeyboardLimits
  inlineKeyboard?: KeyboardLimits
}

export interface AllChannelLimits {
  vkontakte?: ChannelLimits
  telegram?: ChannelLimits
  whatsapp?: ChannelLimits
  sms?: ChannelLimits
  [key: string]: ChannelLimits | undefined
}
