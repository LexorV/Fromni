import { computed } from 'vue'
import { useQuasar } from 'quasar'

export function useMobile() {
  const $q = useQuasar()

  // Определение типа устройства - мобильные это экраны меньше 600px
  const isMobile = computed(() => $q.screen.lt.sm) // lt.sm = меньше 600px
  const isTablet = computed(() => $q.screen.sm || $q.screen.md) // 600px - 1024px
  const isDesktop = computed(() => $q.screen.gt.md) // больше 1024px
  const isTouch = computed(() => $q.platform.is.mobile || $q.platform.is.ipad)

  // Размеры экрана
  const screenSize = computed(() => {
    if ($q.screen.xs) return 'xs'
    if ($q.screen.sm) return 'sm'
    if ($q.screen.md) return 'md'
    if ($q.screen.lg) return 'lg'
    return 'xl'
  })

  // Адаптивные классы
  const responsiveClasses = computed(() => ({
    'mobile-optimized': isMobile.value,
    'tablet-optimized': isTablet.value,
    'desktop-optimized': isDesktop.value,
    'touch-friendly': isTouch.value,
    [`screen-${screenSize.value}`]: true
  }))

  // Адаптивные размеры для компонентов
  const getAdaptiveSize = (desktop: string, mobile: string) => {
    return isMobile.value ? mobile : desktop
  }

  // Адаптивные отступы
  const getAdaptivePadding = (desktop = 'md', mobile = 'sm') => {
    return isMobile.value ? `q-pa-${mobile}` : `q-pa-${desktop}`
  }

  // Адаптивные марджины
  const getAdaptiveMargin = (desktop = 'md', mobile = 'sm') => {
    return isMobile.value ? `q-ma-${mobile}` : `q-ma-${desktop}`
  }

  // Адаптивная высота кнопок
  const getButtonSize = () => {
    if (isMobile.value) return 'md'
    return 'md'
  }

  // Проверка ориентации
  const isPortrait = computed(() => window.innerHeight > window.innerWidth)
  const isLandscape = computed(() => !isPortrait.value)

  // Функция для показа/скрытия элементов в зависимости от размера экрана
  const showOnMobile = computed(() => isMobile.value)
  const hideOnMobile = computed(() => !isMobile.value)

  // Адаптивные настройки для форм
  const getFormConfig = () => ({
    dense: isMobile.value,
    outlined: true,
    class: isMobile.value ? 'mobile-form' : '',
    inputStyle: isMobile.value ? { fontSize: '16px' } : {} // Предотвращает зум на iOS
  })

  // Адаптивные настройки для диалогов
  const getDialogConfig = () => ({
    maximized: isMobile.value,
    fullWidth: isMobile.value,
    fullHeight: isMobile.value && isPortrait.value
  })

  // Адаптивные настройки для карточек
  const getCardConfig = () => ({
    flat: isMobile.value,
    bordered: !isMobile.value,
    class: isMobile.value ? 'mobile-card' : ''
  })

  // Адаптивные настройки для списков
  const getListConfig = () => ({
    dense: isMobile.value,
    separator: true,
    class: isMobile.value ? 'mobile-list' : ''
  })

  // Функция для генерации адаптивных колонок в грид
  const getResponsiveColumns = (xs = 12, sm = 6, md = 4, lg = 3, xl = 2) => ({
    [`col-xs-${xs}`]: true,
    [`col-sm-${sm}`]: true,
    [`col-md-${md}`]: true,
    [`col-lg-${lg}`]: true,
    [`col-xl-${xl}`]: true
  })

  // Утилита для адаптивного текста
  const getResponsiveTextSize = (desktop: string, mobile?: string) => {
    const mobileSize = mobile || desktop
    return isMobile.value ? `text-${mobileSize}` : `text-${desktop}`
  }

  return {
    // Состояния устройства
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    isPortrait,
    isLandscape,
    screenSize,

    // Утилиты
    responsiveClasses,
    showOnMobile,
    hideOnMobile,

    // Функции
    getAdaptiveSize,
    getAdaptivePadding,
    getAdaptiveMargin,
    getButtonSize,
    getFormConfig,
    getDialogConfig,
    getCardConfig,
    getListConfig,
    getResponsiveColumns,
    getResponsiveTextSize
  }
}
