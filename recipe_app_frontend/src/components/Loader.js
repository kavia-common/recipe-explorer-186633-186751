import Blits from '@lightningjs/blits'

export default Blits.Component('Loader', {
  template: `
    <Element w="200" h="60">
      <Element x="0" y="0" w="200" h="60" :color="$theme.surface" radius="12" />
      <Text x="20" y="18" w="160" h="24" content="Loading..." fontSize="20" :textColor="$theme.text" />
    </Element>
  `
})
