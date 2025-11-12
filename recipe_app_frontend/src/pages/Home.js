import Blits from '@lightningjs/blits'
import RecipeCard from '../parts/RecipeCard.js'
import FavoritesPanel from '../parts/FavoritesPanel.js'
import RecipeDetailModal from '../parts/RecipeDetailModal.js'

// Simple utility to read env from import.meta.env if available (Vite)
function getEnv(key, fallback = undefined) {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && key in import.meta.env) {
      return import.meta.env[key]
    }
  } catch (e) {
    // ignore
  }
  return fallback
}

const API_BASE = getEnv('VITE_API_BASE') || getEnv('VITE_BACKEND_URL') || null

// Local mock data if API is absent
const mockRecipes = [
  {
    id: 'r1',
    title: 'Lemon Herb Grilled Chicken',
    image: 'assets/recipe1.jpg',
    tags: ['Grill', 'Chicken', 'Quick'],
    time: '25 min',
    ingredients: ['Chicken breast', 'Lemon', 'Olive oil', 'Rosemary', 'Salt', 'Pepper'],
    steps: [
      'Marinate chicken with lemon, olive oil, herbs, salt, and pepper.',
      'Preheat grill to medium-high.',
      'Grill chicken 6-7 min per side until cooked through.',
      'Rest for 5 minutes, then serve.'
    ]
  },
  {
    id: 'r2',
    title: 'Creamy Mushroom Pasta',
    image: 'assets/recipe2.jpg',
    tags: ['Pasta', 'Vegetarian', 'Comfort'],
    time: '30 min',
    ingredients: ['Pasta', 'Mushrooms', 'Cream', 'Garlic', 'Parmesan', 'Parsley'],
    steps: [
      'Cook pasta until al dente.',
      'Sauté mushrooms and garlic.',
      'Add cream, simmer, and toss with pasta.',
      'Top with parmesan and parsley.'
    ]
  },
  {
    id: 'r3',
    title: 'Citrus Avocado Salad',
    image: 'assets/recipe3.jpg',
    tags: ['Salad', 'Healthy', 'Vegan'],
    time: '15 min',
    ingredients: ['Avocado', 'Orange', 'Grapefruit', 'Spinach', 'Olive oil', 'Vinegar'],
    steps: [
      'Segment citrus, slice avocado.',
      'Mix with spinach.',
      'Dress with olive oil and vinegar.'
    ]
  }
]

export default Blits.Component('Home', {
  template: `
    <Element w="1920" h="1080">
      <!-- Header -->
      <Element x="60" y="32" w="1800" h="88">
        <!-- Title -->
        <Text x="0" y="0" w="800" h="56" :content="$appTitle" :textColor="$theme.text" fontSize="36" />
        <!-- Search bar visual -->
        <Element x="0" y="56" w="1280" h="48" :color="$theme.surface" radius="12" :alpha="$searchFocused ? 1 : 0.95">
          <Element x="0" y="0" w="1280" h="48" :color="$theme.cardShadow" radius="12" alpha="0.08" />
          <Text x="20" y="10" w="1100" h="28" :content="$searchDisplay" fontSize="22" :textColor="$theme.muted" />
          <Element x="1180" y="8" w="88" h="32" :color="$theme.primary" radius="8">
            <Text x="12" y="5" w="64" h="22" content="Search" fontSize="18" textColor="0xffffffff" />
          </Element>
        </Element>
      </Element>

      <!-- Favorites toggle pill -->
      <Element x="1650" y="40" w="210" h="56" :color="$theme.surface" radius="28" :alpha="$favoritesOpen ? 1 : 0.96">
        <Element x="0" y="0" w="210" h="56" :color="$theme.cardShadow" radius="28" alpha="0.08" />
        <Text x="24" y="14" w="130" h="28" content="Favorites" fontSize="22" :textColor="$theme.text" />
        <Element x="160" y="12" w="36" h="32" :color="$theme.secondary" radius="16">
          <Text x="10" y="6" w="16" h="20" :content="$favoritesCount" fontSize="18" textColor="0xffffffff" />
        </Element>
      </Element>

      <!-- Grid wrapper -->
      <Element x="60" y="152" w="1560" h="830">
        <!-- Grid of RecipeCard -->
        <Element
          :for="(card, idx) in $filteredRecipes"
          :key="$card.id"
          :x="$gridX($index)"
          :y="$gridY($index)"
          w="360"
          h="260"
        >
          <RecipeCard
            :id="$card.id"
            :title="$card.title"
            :image="$card.image"
            :tags="$card.tags"
            :time="$card.time"
            :favorited="$isFavorited($card.id)"
            @toggleFavorite="$toggleFavorite"
            @open="$openDetail"
          />
        </Element>
      </Element>

      <!-- Info bar -->
      <Text x="60" y="1000" w="1500" h="40" :content="$footerHelp" fontSize="20" :textColor="$theme.muted" />

      <!-- Favorites Panel -->
      <FavoritesPanel
        x="1560"
        y="120"
        w="320"
        h="880"
        :open="$favoritesOpen"
        :items="$favoriteItems"
        @close="$toggleFavorites"
        @openDetail="$openDetail"
        @toggleFavorite="$toggleFavorite"
      />

      <!-- Detail Modal -->
      <RecipeDetailModal
        x="0"
        y="0"
        w="1920"
        h="1080"
        :open="$detailOpen"
        :recipe="$activeRecipe"
        :favorited="$activeFavorited"
        @close="$closeDetail"
        @toggleFavorite="$toggleFavorite"
      />
    </Element>
  `,
  components: { RecipeCard, FavoritesPanel, RecipeDetailModal },
  state() {
    return {
      appTitle: 'Recipe Explorer',
      recipes: [],
      filteredRecipes: [],
      favorites: new Set(),
      favoritesOpen: false,
      searchQuery: '',
      searchFocused: false,
      detailOpen: false,
      activeRecipe: null,
      footerHelp: 'Use Left/Right to move focus • Enter to open • Back to close panels',
    }
  },
  computed: {
    searchDisplay() {
      return this.searchQuery ? `Search: ${this.searchQuery}` : 'Type keyword with Left/Right to simulate typing • Enter to search'
    },
    favoritesCount() {
      return String(this.favorites.size)
    },
    favoriteItems() {
      const ids = new Set(this.favorites)
      return this.recipes.filter(r => ids.has(r.id))
    },
    activeFavorited() {
      if (!this.activeRecipe) return false
      return this.favorites.has(this.activeRecipe.id)
    }
  },
  methods: {
    async loadRecipes() {
      // Try API fetch if API_BASE exists, otherwise mock
      try {
        if (API_BASE) {
          const url = `${API_BASE.replace(/\/+$/, '')}/recipes`
          const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
          if (res.ok) {
            const data = await res.json()
            // Normalize data structure if needed
            this.recipes = (Array.isArray(data) ? data : data?.items || []).map(this.normalizeRecipe)
          } else {
            this.recipes = mockRecipes
          }
        } else {
          this.recipes = mockRecipes
        }
      } catch (e) {
        this.recipes = mockRecipes
      }
      this.filteredRecipes = this.applyFilter(this.searchQuery)
    },
    normalizeRecipe(item) {
      // Map arbitrary API structure to expected fields
      return {
        id: String(item.id ?? item.slug ?? item.title ?? Math.random()),
        title: item.title ?? 'Untitled',
        image: item.image ?? 'assets/recipe_placeholder.jpg',
        tags: item.tags ?? [],
        time: item.time ?? item.total_time ?? '30 min',
        ingredients: item.ingredients ?? [],
        steps: item.steps ?? []
      }
    },
    applyFilter(query) {
      const q = (query || '').trim().toLowerCase()
      if (!q) return this.recipes
      return this.recipes.filter(r => {
        const field = `${r.title} ${r.tags.join(' ')}`.toLowerCase()
        return field.includes(q)
      })
    },
    persistFavorites() {
      try {
        const arr = Array.from(this.favorites)
        localStorage.setItem('recipe_favorites', JSON.stringify(arr))
      } catch (e) {
        // ignore
      }
    },
    restoreFavorites() {
      try {
        const raw = localStorage.getItem('recipe_favorites')
        if (raw) {
          const arr = JSON.parse(raw)
          this.favorites = new Set(arr)
        }
      } catch (e) {
        // ignore
      }
    },
    // PUBLIC_INTERFACE
    $gridX(idx) {
      /** Computes X for a 4-column grid with 40px gutter. */
      const col = idx % 4
      const baseX = 60
      const cardW = 360
      const gutter = 40
      return baseX + col * (cardW + gutter)
    },
    // PUBLIC_INTERFACE
    $gridY(idx) {
      /** Computes Y for a grid with 20px vertical gutter starting at 152. */
      const row = Math.floor(idx / 4)
      const baseY = 152
      const cardH = 260
      const gutterY = 30
      return baseY + row * (cardH + gutterY)
    },
    // PUBLIC_INTERFACE
    $isFavorited(id) {
      /** Returns true if id is in favorites set. */
      return this.favorites.has(id)
    },
    // PUBLIC_INTERFACE
    $toggleFavorite(id) {
      /** Toggle favorite state for a recipe id and persist to localStorage. */
      if (this.favorites.has(id)) this.favorites.delete(id)
      else this.favorites.add(id)
      this.persistFavorites()
    },
    // PUBLIC_INTERFACE
    $toggleFavorites() {
      /** Open/close favorites panel. */
      this.favoritesOpen = !this.favoritesOpen
    },
    // PUBLIC_INTERFACE
    $openDetail(id) {
      /** Open recipe detail modal for specified id. */
      const found = this.recipes.find(r => r.id === id)
      if (found) {
        this.activeRecipe = found
        this.detailOpen = true
      }
    },
    // PUBLIC_INTERFACE
    $closeDetail() {
      /** Close recipe detail modal. */
      this.detailOpen = false
      this.activeRecipe = null
    },
    // Simulated "typing" search using arrow keys
    pushSearch(char) {
      this.searchQuery = (this.searchQuery + char).slice(0, 40)
      this.filteredRecipes = this.applyFilter(this.searchQuery)
    },
    popSearch() {
      this.searchQuery = this.searchQuery.slice(0, Math.max(0, this.searchQuery.length - 1))
      this.filteredRecipes = this.applyFilter(this.searchQuery)
    }
  },
  async $mounted() {
    this.restoreFavorites()
    await this.loadRecipes()
  },
  input: {
    up() {
      // Focus search
      this.searchFocused = true
    },
    down() {
      // Blur search
      this.searchFocused = false
    },
    left() {
      // Simulate deleting last char when search focused
      if (this.searchFocused) {
        this.popSearch()
      }
    },
    right() {
      // Simulate adding wildcard character '.'
      if (this.searchFocused) {
        this.pushSearch('.')
      }
    },
    enter() {
      if (this.searchFocused) {
        // Re-apply filter (already reactive) but give subtle feedback
        this.footerHelp = 'Searching...'
        setTimeout(() => {
          this.footerHelp = 'Use Left/Right to move focus • Enter to open • Back to close panels'
        }, 400)
      } else {
        // Toggle favorites panel for quick access
        this.$toggleFavorites()
      }
    },
    back() {
      if (this.detailOpen) {
        this.$closeDetail()
        return
      }
      if (this.favoritesOpen) {
        this.$toggleFavorites()
        return
      }
      // Bubble up to app (no-op)
      if (this.parent && this.parent.focus) this.parent.focus()
    }
  }
})
