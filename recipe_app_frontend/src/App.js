import Blits from '@lightningjs/blits'
import Home from './pages/Home.js'

// PUBLIC_INTERFACE
export default Blits.Application({
  /**
   * App root for Recipe Explorer.
   * Renders the router view and applies global theme and background.
   * Routes:
   *  - "/": Home (search, grid, favorites, modal)
   */
  template: `
    <Element w="1920" h="1080" :color="$theme.background">
      <!-- Subtle header background gradient strip -->
      <Element x="0" y="0" w="1920" h="140" :color="$theme.headerGradientTop" />
      <Element x="0" y="120" w="1920" h="960" :color="$theme.background" />

      <RouterView x="0" y="0" w="1920" h="1080" />
    </Element>
  `,
  components: { },
  routes: [
    { path: '/', component: Home, options: { cache: true } }
  ],
  plugins: [
    Blits.Plugins.Theme({
      // Ocean Professional Theme
      name: 'Ocean Professional',
      defaults: {
        background: 0xfff9fafb, // #f9fafb
        surface: 0xffffffff,    // #ffffff
        text: 0xff111827,       // #111827
        primary: 0xff2563eb,    // #2563EB
        secondary: 0xfff59e0b,  // #F59E0B
        success: 0xfff59e0b,
        error: 0xffef4444,
        muted: 0xff6b7280,
        // subtle gradient strip (simulated with two bars)
        headerGradientTop: 0x1a3b82f6, // blue-500/10 approx
        cardShadow: 0x14000000 // translucent for shadow accents
      }
    }),
    Blits.Plugins.Language()
  ],
  state() {
    return {
      appTitle: 'Recipe Explorer'
    }
  }
})
