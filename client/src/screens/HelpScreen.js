import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock FAQ Verileri
const FAQ_DATA = [
  {
    id: 1,
    question: 'Uygulamayı nasıl kullanabilirim?',
    answer: 'Uygulamayı kullanmak için önce hesap oluşturmanız gerekiyor. Ardından ana sayfadan ilanları görüntüleyebilir, yeni ilan oluşturabilir, harita üzerinden bağış noktalarını görebilir ve chatbot ile hayvan sağlığı hakkında bilgi alabilirsiniz.',
  },
  {
    id: 2,
    question: 'İlan nasıl oluştururum?',
    answer: 'İlan oluşturmak için ana sayfadaki "+" butonuna tıklayın. Ardından ilan kategorisini seçin (Yaralı Hayvan, Kayıp, Sahiplendirme, İhbar), gerekli bilgileri doldurun ve fotoğraf ekleyin. İlanınız onaylandıktan sonra yayınlanacaktır.',
  },
  {
    id: 3,
    question: 'Yaralı bir hayvan gördüm, ne yapmalıyım?',
    answer: 'Yaralı bir hayvan gördüğünüzde önce güvenliğinizi sağlayın. Ardından uygulama üzerinden "Yaralı Hayvan" kategorisinde ilan oluşturun. Mümkünse fotoğraf ekleyin ve konum bilgisini doğru girin. Acil durumlarda en yakın veteriner kliniğini veya belediye ekiplerini arayın.',
  },
  {
    id: 4,
    question: 'Kayıp hayvan ilanı nasıl oluşturulur?',
    answer: 'Kayıp hayvan ilanı oluştururken hayvanın fotoğrafını, özelliklerini (renk, cins, yaş, tasma vb.), kaybolduğu konumu ve son görüldüğü tarihi mutlaka belirtin. İletişim bilgilerinizin güncel olduğundan emin olun.',
  },
  {
    id: 5,
    question: 'Sahiplendirme ilanı verirken nelere dikkat etmeliyim?',
    answer: 'Sahiplendirme ilanı verirken hayvanın tüm özelliklerini (yaş, cinsiyet, aşı durumu, kısırlaştırma durumu, sağlık durumu) detaylıca belirtin. Hayvanın fotoğraflarını ekleyin ve sorumlu bir aileye sahiplendirmek için gerekli kontrolleri yapın.',
  },
  {
    id: 6,
    question: 'Harita üzerindeki bağış noktaları nedir?',
    answer: 'Harita üzerindeki bağış noktaları, sokak hayvanları için mama ve su bırakabileceğiniz yerleri gösterir. Bu noktalara QR kod okutarak bağış yapabilir veya yeni bağış noktası ekleyebilirsiniz.',
  },
  {
    id: 7,
    question: 'Chatbot ne işe yarar?',
    answer: 'Chatbot, hayvan sağlığı hakkında temel bilgiler verir. Hayvanınızın semptomlarını paylaşarak genel tavsiyeler alabilirsiniz. Ancak ciddi durumlarda mutlaka bir veterinere başvurmanız gerektiğini unutmayın.',
  },
  {
    id: 8,
    question: 'İlanımı nasıl düzenleyebilirim?',
    answer: 'Kendi ilanlarınızı profil sayfanızdan görüntüleyebilir ve düzenleyebilirsiniz. İlan kartının üzerindeki düzenle butonuna tıklayarak bilgileri güncelleyebilir veya ilanı silebilirsiniz.',
  },
  {
    id: 9,
    question: 'Gizlilik ayarlarımı nasıl değiştirebilirim?',
    answer: 'Profil sayfanızdan menüyü açarak "Gizlilik" seçeneğine tıklayın. Buradan profil görünürlüğünüzü, iletişim bilgilerinizin görünürlüğünü ve bildirim ayarlarınızı değiştirebilirsiniz.',
  },
  {
    id: 10,
    question: 'Uygulamada sorun yaşıyorum, kime başvurabilirim?',
    answer: 'Uygulamada herhangi bir sorun yaşarsanız, aşağıdaki e-posta adresinden bizimle iletişime geçebilirsiniz. Sorununuzu detaylıca açıklayın ve mümkünse ekran görüntüsü ekleyin. En kısa sürede size dönüş yapacağız.',
  },
];

const HelpScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleItem = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:destek@askidamama.com?subject=Yardım Talebi');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerContainer}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yardım</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sıkça Sorulan Sorular Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sıkça Sorulan Sorular</Text>
          <View style={styles.faqContainer}>
            {FAQ_DATA.map((item) => {
              const isExpanded = expandedItems.includes(item.id);
              return (
                <View key={item.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestionText}>{item.question}</Text>
                    <Text style={styles.expandIcon}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* İletişim Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <View style={styles.contactContainer}>
            <Text style={styles.contactDescription}>
              Sorularınız, önerileriniz veya destek talepleriniz için bizimle
              iletişime geçebilirsiniz.
            </Text>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={handleEmailPress}
              activeOpacity={0.8}
            >
              <Text style={styles.emailIcon}>✉️</Text>
              <Text style={styles.emailText}>destek@askidamama.com</Text>
            </TouchableOpacity>
            <Text style={styles.contactNote}>
              E-posta göndermek için yukarıdaki butona tıklayın
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 12,
  },
  expandIcon: {
    fontSize: 14,
    color: '#666',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#FFE0B2',
  },
  faqAnswerText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginTop: 12,
  },
  contactContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  emailIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactNote: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HelpScreen;

