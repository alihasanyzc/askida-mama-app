/**
 * ============================================================================
 * OKUMA SIRASI: 1. BÖLÜM - IMPORTS VE BAĞIMLILIKLAR
 * ============================================================================
 * Bu bölümde component'in ihtiyaç duyduğu tüm kütüphaneler ve modüller import edilir.
 * 
 * React ve React Native:
 * - React hooks (useCallback, useMemo, useRef, useState) - performans optimizasyonu için
 * - React Native bileşenleri (View, Text, FlatList, TouchableOpacity, vb.)
 * - Animated API - header animasyonları için
 * 
 * Üçüncü parti kütüphaneler:
 * - useSafeAreaInsets - iPhone notch ve safe area için
 * - Entypo icons - search icon için
 * 
 * Proje içi modüller:
 * - constants - renkler, spacing, fontlar
 * - BlogCard component - blog post kartlarını render eden component
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';
import BlogCard from '../components/common/BlogCard';

/**
 * ============================================================================
 * OKUMA SIRASI: 2. BÖLÜM - COMPONENT-SPECIFIC CONSTANTS
 * ============================================================================
 * Bu bölümde sadece bu component'e özel sabitler tanımlanır.
 * Genel constants (COLORS, SPACING, vb.) constants klasöründe tutulur.
 * 
 * SCROLL_CONFIG: Scroll davranışı için ayarlar
 * - THRESHOLD: Scroll yönünü algılamak için minimum pixel farkı (5px)
 * - EVENT_THROTTLE: Scroll event'lerinin ne sıklıkla tetikleneceği (16ms = 60fps)
 */
const SCROLL_CONFIG = {
  THRESHOLD: 5,           // Scroll yönü algılama eşiği (pixel)
  EVENT_THROTTLE: 16,     // Scroll event throttle (ms) - 60fps için
};

/**
 * ANIMATION_CONFIG: Header animasyonları için ayarlar
 * - HIDE_DURATION: Header'ın kaybolma animasyon süresi (ms)
 * - SHOW_TENSION: Spring animasyonunun gerilim değeri (yüksek = daha hızlı)
 * - SHOW_FRICTION: Spring animasyonunun sürtünme değeri (yüksek = daha yavaş)
 */
const ANIMATION_CONFIG = {
  HIDE_DURATION: 200,     // Header gizlenme animasyon süresi (ms)
  SHOW_TENSION: 100,      // Spring animasyon gerilimi (drawer-like effect için)
  SHOW_FRICTION: 8,       // Spring animasyon sürtünmesi
};

/**
 * HEADER_DIMENSIONS: Header bileşenlerinin boyutları
 * Bu değerler headerHeight hesaplamasında kullanılır
 */
const HEADER_DIMENSIONS = {
  HEIGHT: 40,             // Header bar yüksekliği (px)
  LOGO_SIZE: 48,          // Logo çemberinin çapı (px)
  CREATE_BUTTON_SIZE: 40,  // + butonunun boyutu (px)
  SEARCH_BAR_HEIGHT: 40,   // Arama çubuğu yüksekliği (px)
};

/**
 * FLATLIST_CONFIG: FlatList performans optimizasyonu için ayarlar
 * Bu değerler büyük listelerde performansı artırır
 */
const FLATLIST_CONFIG = {
  INITIAL_NUM_TO_RENDER: 5,      // İlk render'da kaç item gösterilecek
  MAX_TO_RENDER_PER_BATCH: 5,    // Her batch'te maksimum render edilecek item sayısı
  WINDOW_SIZE: 10,                // Render penceresi boyutu (viewport'un kaç katı)
};

/**
 * ICON_SIZES: Icon boyutları
 */
const ICON_SIZES = {
  SEARCH: 16,  // Arama icon boyutu (px)
  PAW: 24,     // Logo paw icon boyutu (px)
};

/**
 * ============================================================================
 * OKUMA SIRASI: 3. BÖLÜM - MOCK DATA
 * ============================================================================
 * Bu bölümde test/development için mock blog verileri tanımlanır.
 * 
 * ÖNEMLİ: Bu veri component dışında tanımlanır çünkü:
 * - Her render'da yeniden oluşturulmaz (performans)
 * - Component re-render olsa bile aynı referansı korur
 * - useMemo ile optimize edilmiş şekilde kullanılır
 * 
 * Gerçek uygulamada bu veriler API'den gelecek ve state'te tutulacak.
 */
const MOCK_BLOGS = [
    {
      id: '1',
      category: 'Sağlık',
      author: {
        name: 'Dr. Zeynep Kaya',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      date: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
      title: 'Yaralı bir sokak hayvanını gördüğünüzde ne yapmalısınız?',
      description: 'I have just spent 3 amazing days in my home town! 🤩',
      likes: 342,
    },
    {
      id: '2',
      category: 'Mama & Barınma',
      author: {
        name: 'Dr. Mehmet Arslan',
        avatar: 'https://i.pravatar.cc/150?img=33',
      },
      date: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
      title: 'Kış aylarında sokak kedilerine nasıl yardım edebiliriz?',
      description: 'Soğuk hava koşullarında sokak kedilerinin ihtiyaçları ve onlara nasıl destek olabileceğiniz hakkında önemli bilgiler...',
      likes: 428,
    },
    {
      id: '3',
      category: 'Yardım Hikayeleri',
      author: {
        name: 'Ayşe Demir',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      date: '1 day ago',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
      title: 'Sokaktan kurtardığım köpeğim artık ailemizin bir parçası',
      description: 'Yağmurlu bir gecede karşılaştığım yaralı köpeği nasıl kurtardım ve hayatımızı nasıl değiştirdi...',
      likes: 892,
    },
    {
      id: '4',
      category: 'Sağlık',
      author: {
        name: 'Dr. Can Yılmaz',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      date: '2 days ago',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800',
      title: 'Sokak hayvanlarında en sık görülen hastalıklar',
      description: 'Veteriner olarak en çok karşılaştığım sokak hayvanı hastalıkları ve önleme yöntemleri hakkında bilmeniz gerekenler...',
      likes: 567,
    },
    {
      id: '5',
      category: 'Mama & Barınma',
      author: {
        name: 'Elif Kara',
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
      date: '3 days ago',
      image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800',
      title: 'Sokak hayvanları için mama bağışı nasıl yapılır?',
      description: 'Sokaktaki dostlarımıza düzenli mama desteği sağlamanın yolları ve dikkat edilmesi gereken noktalar...',
      likes: 734,
    },
    {
      id: '6',
      category: 'Yardım Hikayeleri',
      author: {
        name: 'Murat Öztürk',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
      date: '4 days ago',
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800',
      title: 'Mahalle sakinleri olarak kurduk: Sokak Hayvanları Derneği',
      description: 'Komşularımızla bir araya gelerek sokak hayvanlarına yardım için dernek kurma sürecimiz...',
      likes: 1205,
    },
    {
      id: '7',
      category: 'Sağlık',
      author: {
        name: 'Dr. Selin Aydın',
        avatar: 'https://i.pravatar.cc/150?img=20',
      },
      date: '5 days ago',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
      title: 'Sokak köpeklerinde kuduz aşısının önemi',
      description: 'Kuduz hastalığı nedir, nasıl bulaşır ve sokak hayvanları için aşılama programları nasıl çalışır?',
      likes: 456,
    },
    {
      id: '8',
      category: 'Mama & Barınma',
      author: {
        name: 'Ahmet Şahin',
        avatar: 'https://i.pravatar.cc/150?img=18',
      },
      date: '6 days ago',
      image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800',
      title: 'DIY: Kedi evi yapımı adım adım rehber',
      description: 'Basit malzemelerle sokak kedileri için sıcak ve güvenli bir barınak nasıl yapılır?',
      likes: 923,
    },
    {
      id: '9',
      category: 'Yardım Hikayeleri',
      author: {
        name: 'Zehra Bulut',
        avatar: 'https://i.pravatar.cc/150?img=25',
      },
      date: '1 week ago',
      image: 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800',
      title: '6 ayda 50 kedi kısırlaştırdık: Mahalle projemiz',
      description: 'Sokak kedilerinin kontrolsüz çoğalmasını önlemek için başlattığımız kısırlaştırma projesinin hikayesi...',
      likes: 1567,
    },
    {
      id: '10',
      category: 'Sağlık',
      author: {
        name: 'Dr. Burak Tekin',
        avatar: 'https://i.pravatar.cc/150?img=30',
      },
      date: '1 week ago',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
      title: 'Sokak hayvanlarında parazit kontrolü',
      description: 'Pire, kene ve iç parazitler sokak hayvanlarını nasıl etkiler ve toplum sağlığı için neden önemlidir?',
      likes: 689,
    },
];

/**
 * ============================================================================
 * OKUMA SIRASI: 4. BÖLÜM - COMPONENT TANIMI VE HOOKS
 * ============================================================================
 * 
 * DiscoverScreen Component
 * Ana keşfet ekranı - blog postlarını gösterir, collapsible header ve arama çubuğu içerir.
 * Instagram tarzı scroll davranışı: yukarı scroll'da header kaybolur, aşağı scroll'da görünür.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation navigation object
 */
const DiscoverScreen = ({ navigation }) => {
  /**
   * --------------------------------------------------------------------------
   * 4.1. SAFE AREA INSETS
   * --------------------------------------------------------------------------
   * iPhone notch ve safe area için padding değerlerini alır.
   * iOS'ta üst kısımdaki notch alanını hesaplamak için kullanılır.
   */
  const insets = useSafeAreaInsets();
  
  /**
   * --------------------------------------------------------------------------
   * 4.2. ANIMATION REFS
   * --------------------------------------------------------------------------
   * Animated API için ref'ler. Bu ref'ler animasyon değerlerini tutar.
   * 
   * scrollY: Header'ın görünürlüğünü kontrol eden animasyon değeri (0-1 arası)
   *   - 0: Header görünür
   *   - 1: Header gizli
   * 
   * scrollPosition: FlatList'in scroll pozisyonunu tutar (gelecekte kullanım için)
   * 
   * lastScrollY: Önceki scroll pozisyonunu tutar (scroll yönünü hesaplamak için)
   * 
   * flatListRef: FlatList'e erişim için ref (scrollToOffset için)
   */
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const flatListRef = useRef(null);
  
  /**
   * --------------------------------------------------------------------------
   * 4.3. COMPONENT STATE
   * --------------------------------------------------------------------------
   * isScrollingDown: Scroll yönünü takip eder
   *   - true: Kullanıcı yukarı scroll ediyor (header gizli)
   *   - false: Kullanıcı aşağı scroll ediyor veya en üstte (header görünür)
   */
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * 4.4. MEMOIZED DATA
   * --------------------------------------------------------------------------
   * allBlogs: Blog listesini memoize eder
   * useMemo kullanılmasının nedeni: Her render'da yeni array oluşturulmasını önlemek
   * Dependency array boş [] çünkü MOCK_BLOGS sabit bir değer
   */
  const allBlogs = useMemo(() => MOCK_BLOGS, []);

  /**
   * ============================================================================
   * OKUMA SIRASI: 5. BÖLÜM - EVENT HANDLERS VE HESAPLAMALAR
   * ============================================================================
   */
  
  /**
   * --------------------------------------------------------------------------
   * 5.1. HANDLE SCROLL - Scroll Event Handler
   * --------------------------------------------------------------------------
   * FlatList scroll event'lerini dinler ve header'ı gösterir/gizler.
   * Instagram tarzı davranış: Yukarı scroll'da hızlı kaybolur, aşağı scroll'da yavaşça görünür.
   * 
   * ÇALIŞMA MANTIĞI:
   * 1. Mevcut scroll pozisyonunu alır (currentScrollY)
   * 2. Önceki pozisyonla karşılaştırarak scroll yönünü belirler (scrollDifference)
   * 3. Scroll yönüne göre header'ı animasyonlu şekilde gösterir/gizler
   * 
   * @param {Object} event - Scroll event object (FlatList'ten gelen)
   * @param {Object} event.nativeEvent.contentOffset.y - Mevcut scroll pozisyonu
   * 
   * useCallback kullanılmasının nedeni: Her render'da yeni fonksiyon oluşturulmasını önlemek
   */
  const handleScroll = useCallback((event) => {
    // Mevcut scroll pozisyonunu al (FlatList'in contentOffset.y değeri)
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    // Scroll yönünü hesapla: pozitif = aşağı, negatif = yukarı
    const scrollDifference = currentScrollY - lastScrollY.current;
    
    // Scroll pozisyonunu güncelle (gelecekte kullanım için saklanır)
    scrollPosition.setValue(currentScrollY);
    
    /**
     * DURUM 1: YUKARI SCROLL (Header'ı gizle)
     * Koşul: scrollDifference < -5px VE header şu anda görünür
     * Animasyon: Hızlı timing animasyonu (200ms)
     */
    if (scrollDifference < -SCROLL_CONFIG.THRESHOLD && !isScrollingDown) {
      setIsScrollingDown(true);  // State'i güncelle: artık yukarı scroll ediyoruz
      Animated.timing(scrollY, {
        toValue: 1,              // scrollY = 1 → header gizli
        duration: ANIMATION_CONFIG.HIDE_DURATION,
        useNativeDriver: true,   // Native driver kullan (daha performanslı)
      }).start();
    } 
    /**
     * DURUM 2: AŞAĞI SCROLL (Header'ı göster - drawer-like)
     * Koşul: scrollDifference > 5px VE header şu anda gizli
     * Animasyon: Yumuşak spring animasyonu (drawer gibi)
     */
    else if (scrollDifference > SCROLL_CONFIG.THRESHOLD && isScrollingDown) {
      setIsScrollingDown(false); // State'i güncelle: artık aşağı scroll ediyoruz
      Animated.spring(scrollY, {
        toValue: 0,              // scrollY = 0 → header görünür
        tension: ANIMATION_CONFIG.SHOW_TENSION,   // Spring gerilimi
        friction: ANIMATION_CONFIG.SHOW_FRICTION, // Spring sürtünmesi
        useNativeDriver: true,
      }).start();
    } 
    /**
     * DURUM 3: EN ÜSTTE (Header'ı her zaman göster)
     * Koşul: currentScrollY <= 0 VE header şu anda gizli
     * Kullanıcı en üste geldiğinde header otomatik görünür
     */
    else if (currentScrollY <= 0 && isScrollingDown) {
      setIsScrollingDown(false);
      Animated.spring(scrollY, {
        toValue: 0,
        tension: ANIMATION_CONFIG.SHOW_TENSION,
        friction: ANIMATION_CONFIG.SHOW_FRICTION,
        useNativeDriver: true,
      }).start();
    }
    
    // Son scroll pozisyonunu kaydet (bir sonraki scroll event'i için)
    lastScrollY.current = currentScrollY;
  }, [isScrollingDown, scrollY, scrollPosition]); // Dependencies: bu değerler değiştiğinde fonksiyon yeniden oluşturulur

  /**
   * --------------------------------------------------------------------------
   * 5.2. HEADER HEIGHT - Header Yüksekliği Hesaplama
   * --------------------------------------------------------------------------
   * Header'ın toplam yüksekliğini hesaplar (safe area + header bar + search bar).
   * Bu değer animasyonlarda ve FlatList padding'inde kullanılır.
   * 
   * HESAPLAMA:
   * - Safe area top (iPhone notch için)
   * - Header bar yüksekliği
   * - Search bar yüksekliği
   * - Aralarındaki spacing'ler
   * 
   * useMemo kullanılmasının nedeni: insets.top değişmediği sürece yeniden hesaplanmaz
   * 
   * @returns {number} Header'ın toplam yüksekliği (pixel)
   */
  const headerHeight = useMemo(() => {
    return (
      insets.top +                              // Safe area (iPhone notch)
      SPACING.xs +                              // Üst padding
      HEADER_DIMENSIONS.HEIGHT +                // Header bar yüksekliği
      SPACING.xs +                              // Header ile search arası spacing
      SPACING.xs +                              // Ekstra spacing
      HEADER_DIMENSIONS.SEARCH_BAR_HEIGHT +     // Search bar yüksekliği
      SPACING.xs                                // Alt padding
    );
  }, [insets.top]); // Dependency: insets.top değiştiğinde yeniden hesapla

  /**
   * --------------------------------------------------------------------------
   * 5.3. FLATLIST PADDING TOP - FlatList Üst Padding Hesaplama
   * --------------------------------------------------------------------------
   * FlatList'in üst padding'ini hesaplar. Bu padding, blog postlarının header'ın
   * altında kalmasını önler. Header absolute position'da olduğu için FlatList
   * içeriği header'ın altından başlamalıdır.
   * 
   * @returns {number} FlatList'in üst padding değeri (pixel)
   */
  const flatListPaddingTop = useMemo(() => {
    return headerHeight + SPACING.xs; // Header yüksekliği + ekstra spacing
  }, [headerHeight]); // Dependency: headerHeight değiştiğinde yeniden hesapla

  /**
   * --------------------------------------------------------------------------
   * 5.4. HANDLE LOGO PRESS - Logo Tıklama Handler
   * --------------------------------------------------------------------------
   * Logo'ya tıklandığında FlatList'i en üste scroll eder.
   * Kullanıcı deneyimi için: Logo = ana sayfaya dön butonu
   * 
   * scrollToOffset: FlatList'in scroll pozisyonunu değiştirir
   * - offset: 0 → en üst pozisyon
   * - animated: true → animasyonlu scroll
   */
  const handleLogoPress = useCallback(() => {
    flatListRef.current?.scrollToOffset({ 
      offset: 0,        // Scroll pozisyonu: 0 = en üst
      animated: true    // Animasyonlu scroll (daha smooth)
    });
  }, []); // Dependency yok: fonksiyon hiç değişmez

  /**
   * --------------------------------------------------------------------------
   * 5.5. HANDLE AUTHOR PRESS - Author Tıklama Handler
   * --------------------------------------------------------------------------
   * Blog post'un author'ına tıklandığında UserProfile ekranına navigate eder.
   * 
   * İŞLEMLER:
   * 1. Author bilgilerini kontrol et (null check)
   * 2. Username oluştur (isimden deterministic username)
   * 3. Rank hesapla (author ID'den deterministic rank)
   * 4. Navigation ile UserProfile'e git
   * 
   * @param {Object} item - Blog post item (author bilgilerini içerir)
   */
  const handleAuthorPress = useCallback((item) => {
    // Null check: Eğer author yoksa fonksiyondan çık
    if (!item?.author) return;
    
    /**
     * Username oluştur: "Dr. Zeynep Kaya" → "dr_zeynep_kaya"
     * - Küçük harfe çevir
     * - Boşlukları alt çizgiye çevir
     * - Noktaları kaldır
     */
    const username = item.author.name
      .toLowerCase()           // Küçük harfe çevir
      .replace(/\s+/g, '_')    // Boşlukları alt çizgiye çevir
      .replace(/\./g, '');     // Noktaları kaldır
    
    /**
     * Rank hesapla: Author ID'den deterministic bir rank üret
     * Deterministic = Aynı ID her zaman aynı rank'ı verir
     * Modulo operatörü ile 1-50 arası bir değer üretir
     */
    const authorId = item.author.id || item.id;
    const rank = (authorId.charCodeAt(0) % 50) + 1;
    
    /**
     * Navigation: UserProfile ekranına git
     * user objesi içinde profil bilgileri gönderilir
     */
    navigation.navigate('UserProfile', {
      user: {
        id: authorId,
        name: item.author.name,
        username,
        avatar: item.author.avatar,
        bio: 'Veteriner hekim 🩺 Sokak hayvanları için gönüllü 🐾',
        stats: {
          blogs: 18,
          followers: 892,
          following: 245,
          rank,
        },
        donations: {
          food: { current: 850, goal: 2000 },
          medical: { current: 2100, goal: 5000 },
        },
      },
    });
  }, [navigation]); // Dependency: navigation değiştiğinde fonksiyon yeniden oluşturulur

  /**
   * ============================================================================
   * OKUMA SIRASI: 6. BÖLÜM - RENDER FUNCTIONS
   * ============================================================================
   * Bu bölümde FlatList ve diğer bileşenler için render fonksiyonları tanımlanır.
   */
  
  /**
   * --------------------------------------------------------------------------
   * 6.1. RENDER BLOG CARD - Blog Kartı Render Fonksiyonu
   * --------------------------------------------------------------------------
   * FlatList'in renderItem prop'u için kullanılır.
   * Her blog post için bir BlogCard component'i render eder.
   * 
   * useCallback kullanılmasının nedeni:
   * - FlatList her item için bu fonksiyonu çağırır
   * - Her render'da yeni fonksiyon oluşturmak performans sorununa yol açar
   * - useCallback ile fonksiyon memoize edilir
   * 
   * @param {Object} param0 - FlatList'in renderItem'dan gelen parametreler
   * @param {Object} param0.item - Blog post verisi
   * @returns {JSX.Element} BlogCard component
   */
  const renderBlogCard = useCallback(({ item }) => (
    <BlogCard
      author={item.author}           // Yazar bilgileri
      date={item.date}                // Post tarihi
      image={item.image}              // Post görseli
      title={item.title}              // Post başlığı
      description={item.description}  // Post açıklaması
      likes={item.likes}              // Beğeni sayısı
      category={item.category}         // Post kategorisi
      // Development modunda console.log, production'da undefined
      onLike={__DEV__ ? () => console.log('Like pressed:', item.id) : undefined}
      onBookmark={__DEV__ ? () => console.log('Bookmark pressed:', item.id) : undefined}
      onAuthorPress={() => handleAuthorPress(item)}  // Author'a tıklandığında
    />
  ), [handleAuthorPress]); // Dependency: handleAuthorPress değiştiğinde yeniden oluştur

  /**
   * --------------------------------------------------------------------------
   * 6.2. KEY EXTRACTOR - FlatList Key Extraction
   * --------------------------------------------------------------------------
   * FlatList'in keyExtractor prop'u için kullanılır.
   * Her item için unique bir key döndürür (React'in list rendering optimizasyonu için).
   * 
   * Neden önemli:
   * - React, listelerde hangi item'ın değiştiğini anlamak için key kullanır
   * - Key yoksa veya yanlışsa performans sorunları ve render hataları oluşur
   * 
   * @param {Object} item - Blog post item
   * @returns {string} Item'ın unique ID'si
   */
  const keyExtractor = useCallback((item) => item.id, []); // Dependency yok: fonksiyon hiç değişmez

  /**
   * --------------------------------------------------------------------------
   * 6.3. RENDER EMPTY COMPONENT - Boş Liste Component'i
   * --------------------------------------------------------------------------
   * FlatList'in ListEmptyComponent prop'u için kullanılır.
   * Blog post yoksa gösterilecek boş state component'i.
   * 
   * @returns {JSX.Element} Boş state component
   */
  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Henüz post bulunmuyor</Text>
    </View>
  ), []); // Dependency yok: component hiç değişmez

  /**
   * ============================================================================
   * OKUMA SIRASI: 7. BÖLÜM - JSX RETURN (UI RENDERING)
   * ============================================================================
   * Bu bölümde component'in görsel arayüzü (UI) tanımlanır.
   * Component'in return değeri burada oluşturulur.
   */
  
  return (
    <View style={styles.container}>
      {/* 
        --------------------------------------------------------------------------
        7.1. STATUS BAR
        --------------------------------------------------------------------------
        StatusBar: Telefonun üst kısmındaki status bar'ı (saat, batarya, vb.) kontrol eder.
        - barStyle: "dark-content" → siyah iconlar (açık arka plan için)
        - backgroundColor: "transparent" → şeffaf arka plan
        - translucent: true → içerik status bar'ın altına geçebilir
      */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      {/* 
        --------------------------------------------------------------------------
        7.2. ANIMATED HEADER CONTAINER
        --------------------------------------------------------------------------
        Header ve search bar'ı içeren animasyonlu container.
        scrollY değerine göre yukarı/aşağı hareket eder.
        
        ANIMATION MANTIĞI:
        - scrollY.interpolate: scrollY değerini (0-1) translateY değerine çevirir
        - inputRange: [0, headerHeight] → scrollY'nin alabileceği değerler
        - outputRange: [0, -headerHeight] → translateY'nin alacağı değerler
          * scrollY = 0 → translateY = 0 (header görünür, normal pozisyon)
          * scrollY = headerHeight → translateY = -headerHeight (header gizli, yukarı kaymış)
        - extrapolate: 'clamp' → değerler sınırlar dışına çıkamaz
      */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top + SPACING.xs,  // Safe area için üst padding
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, headerHeight],
                  outputRange: [0, -headerHeight],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        {/* 
          --------------------------------------------------------------------------
          7.2.1. HEADER BAR (Üst Bar)
          --------------------------------------------------------------------------
          Üç bölümden oluşur: + butonu, logo, placeholder (boş alan)
        */}
        <View style={styles.header}>
          {/* + BUTONU: Yeni post oluşturma butonu */}
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreatePost')}
            activeOpacity={0.7}
            accessibilityLabel="Yeni post oluştur"
            accessibilityRole="button"
          >
            <View style={styles.createIcon}>
              <Text style={styles.createIconText}>+</Text>
            </View>
          </TouchableOpacity>

          {/* LOGO: Ana sayfaya dön butonu (tıklanabilir) */}
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={handleLogoPress}
            activeOpacity={0.7}
            accessibilityLabel="Ana sayfaya dön"
            accessibilityRole="button"
            testID="logo-button"
          >
            <View style={styles.logo} accessibilityLabel="Askıda Mama">
              <Text style={styles.pawIcon}>🐾</Text>
            </View>
          </TouchableOpacity>

          {/* PLACEHOLDER: Sağ tarafta boş alan (dengeli görünüm için) */}
          <View style={styles.placeholder} />
        </View>

        {/* 
          --------------------------------------------------------------------------
          7.2.2. SEARCH BAR (Arama Çubuğu)
          --------------------------------------------------------------------------
          Arama ekranına yönlendiren tıklanabilir arama çubuğu
        */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}
          accessibilityLabel="Arama yap"
          accessibilityRole="button"
          testID="search-button"
        >
          <View style={styles.searchBar}>
            {/* Arama iconu (Entypo icon library'den) */}
            <Entypo 
              name="magnifying-glass" 
              size={ICON_SIZES.SEARCH} 
              color={COLORS.gray} 
              style={styles.searchIcon}
            />
            {/* Placeholder text */}
            <Text style={styles.searchPlaceholder}>Ara</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* 
        --------------------------------------------------------------------------
        7.3. FLATLIST - Blog Post Listesi
        --------------------------------------------------------------------------
        Blog postlarını gösteren scroll edilebilir liste.
        
        PERFORMANS OPTİMİZASYONLARI:
        - initialNumToRender: İlk render'da sadece 5 item göster (daha hızlı ilk render)
        - maxToRenderPerBatch: Her batch'te maksimum 5 item render et
        - windowSize: Render penceresi boyutu (viewport'un 10 katı)
        - removeClippedSubviews: Görünmeyen view'ları DOM'dan kaldır (memory tasarrufu)
        - scrollEventThrottle: Scroll event'lerini throttle et (16ms = 60fps)
        
        SCROLL ANIMATION:
        - onScroll: Animated.event ile scroll pozisyonunu scrollPosition'a bağlar
        - listener: handleScroll fonksiyonunu çağırır (header animasyonu için)
        - useNativeDriver: false (çünkü scrollPosition kullanılıyor, native driver desteklemiyor)
      */}
      <FlatList
        ref={flatListRef}                                    // Ref: scrollToOffset için
        data={allBlogs}                                      // Blog post verileri
        renderItem={renderBlogCard}                          // Her item için render fonksiyonu
        keyExtractor={keyExtractor}                          // Unique key extraction
        showsVerticalScrollIndicator={false}                 // Scroll bar'ı gizle
        contentContainerStyle={[
          styles.flatListContent,
          { paddingTop: flatListPaddingTop },                // Header'ın altında başlaması için padding
        ]}
        initialNumToRender={FLATLIST_CONFIG.INITIAL_NUM_TO_RENDER}
        maxToRenderPerBatch={FLATLIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
        windowSize={FLATLIST_CONFIG.WINDOW_SIZE}
        removeClippedSubviews={true}                         // Görünmeyen view'ları kaldır
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollPosition } } }],  // Scroll pozisyonunu scrollPosition'a bağla
          { useNativeDriver: false, listener: handleScroll }              // handleScroll'u listener olarak ekle
        )}
        scrollEventThrottle={SCROLL_CONFIG.EVENT_THROTTLE}   // Event throttle (16ms = 60fps)
        ListEmptyComponent={renderEmptyComponent}             // Boş liste component'i
        testID="blog-posts-list"                             // Test ID (testing için)
      />
    </View>
  );
};

/**
 * ============================================================================
 * OKUMA SIRASI: 8. BÖLÜM - STYLES (STİL TANIMLARI)
 * ============================================================================
 * Bu bölümde component'in görsel stilleri tanımlanır.
 * StyleSheet.create kullanılması performans için önemlidir (her render'da yeniden oluşturulmaz).
 */
const styles = StyleSheet.create({
  /**
   * CONTAINER: Ana container
   * - flex: 1 → Tüm ekranı kaplar
   * - backgroundColor: Beyaz arka plan
   */
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  /**
   * HEADER CONTAINER: Header ve search bar'ı içeren container
   * - position: 'absolute' → Diğer elementlerin üstünde konumlanır
   * - zIndex: 100 → Diğer elementlerin üstünde görünür
   * - top, left, right: 0 → Ekranın üst kısmına yapışır
   */
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: COLORS.white,
  },
  
  /**
   * HEADER: Üst bar (logo, + butonu)
   * - flexDirection: 'row' → Elemanlar yatay dizilir
   * - justifyContent: 'space-between' → Elemanlar arasında boşluk
   * - borderBottomWidth: Alt çizgi (ayırıcı)
   */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  
  /**
   * CREATE BUTTON: + butonu container'ı
   * Sabit boyutlu (40x40px)
   */
  createButton: {
    width: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    height: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /**
   * CREATE ICON: + butonunun içindeki icon container'ı
   * Yuvarlatılmış köşeler ve merkez hizalama
   */
  createIcon: {
    width: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    height: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /**
   * CREATE ICON TEXT: + sembolü
   * - fontSize: 40 → Büyük + işareti
   * - fontWeight: '300' → İnce font
   * - lineHeight: Buton yüksekliği ile aynı (dikey hizalama için)
   */
  createIconText: {
    fontSize: 40,
    color: COLORS.primary,
    fontWeight: '300',
    lineHeight: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    textAlign: 'center',
  },
  
  /**
   * LOGO CONTAINER: Logo container'ı (flex: 1 → ortada konumlanır)
   */
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  /**
   * LOGO: Logo çemberi
   * - borderRadius: LOGO_SIZE / 2 → Tam çember
   * - backgroundColor: Primary renk (turuncu)
   */
  logo: {
    width: HEADER_DIMENSIONS.LOGO_SIZE,
    height: HEADER_DIMENSIONS.LOGO_SIZE,
    borderRadius: HEADER_DIMENSIONS.LOGO_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /**
   * PAW ICON: 🐾 emoji
   */
  pawIcon: {
    fontSize: ICON_SIZES.PAW,
  },
  
  /**
   * PLACEHOLDER: Sağ tarafta boş alan (+ butonu ile aynı genişlikte)
   * Header'ın dengeli görünmesi için
   */
  placeholder: {
    width: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
  },
  
  /**
   * SEARCH CONTAINER: Arama çubuğu container'ı
   */
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.white,
  },
  
  /**
   * SEARCH BAR: Arama çubuğu (gri arka plan, yuvarlatılmış köşeler)
   * - flexDirection: 'row' → Icon ve text yatay dizilir
   * - backgroundColor: COLORS.background → Açık gri arka plan
   */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  
  /**
   * SEARCH ICON: Arama iconu için margin
   */
  searchIcon: {
    marginRight: SPACING.sm,
  },
  
  /**
   * SEARCH PLACEHOLDER: "Ara" placeholder text'i
   */
  searchPlaceholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  
  /**
   * FLATLIST CONTENT: FlatList içeriği için padding
   */
  flatListContent: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.lg,
  },
  
  /**
   * EMPTY CONTAINER: Boş liste container'ı (merkez hizalı)
   */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  
  /**
   * EMPTY TEXT: Boş liste mesajı
   * - fontFamily: SF Pro Text (iOS'ta sistem fontu)
   */
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.text, // SF Pro Text
    color: COLORS.gray,
    textAlign: 'center',
  },
});

/**
 * ============================================================================
 * OKUMA SIRASI: 9. BÖLÜM - EXPORT
 * ============================================================================
 * Component'i dışa aktarır. Diğer dosyalar bu component'i import edebilir.
 */
export default DiscoverScreen;
