import {Switch as RnSwitch, type SwitchProps} from 'react-native'
import {getTokens} from 'tamagui'

interface Props extends Partial<SwitchProps> {}

export default function Switch(props: Props): JSX.Element {
  const tokens = getTokens()
  return (
    <RnSwitch
      trackColor={{false: tokens.color.grey.val, true: tokens.color.main.val}}
      thumbColor={tokens.color.white.val}
      {...props}
    />
  )
}
