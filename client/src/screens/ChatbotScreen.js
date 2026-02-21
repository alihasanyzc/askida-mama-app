import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const CHAT_BG = '#F8F8F8';

// Kural tabanlı yanıtlar
const RULE_BASED_RESPONSES = {
  // Hayvanın türü seçer
  'kedi': {
    response: 'Kedi dostunuz için hangi konuda yardımcı olabilirim?',
    questions: [
      'Öncelikle, hayvanın türünü seçer misin?',
      'Kedi veya köpek?',
    ],
  },
  'köpek': {
    response: 'Köpek dostunuz için hangi konuda yardımcı olabilirim?',
    questions: [
      'Öncelikle, hayvanın türünü seçer misin?',
      'Kedi veya köpek?',
    ],
  },
  // Genel sağlık soruları
  'kusma': {
    response: 'Kusma birçok nedenden kaynaklanabilir:\n\n• Hızlı yemek yeme\n• Yabancı cisim yutma\n• Gıda değişikliği\n• Parazit enfeksiyonu\n\nEğer kusma tekrarlıyorsa ve 24 saatten fazla sürüyorsa mutlaka veterinere götürün. Dehidrasyona dikkat edin!',
    isBot: true,
  },
  'ishal': {
    response: 'İshal durumunda:\n\n• 12-24 saat mama vermeyin, sadece su verin\n• Probiyotik verebilirsiniz\n• Hazmı kolay mamalara geçin\n• Eğer kanlı ishal varsa ACIL veteriner!\n\nDehidrasyonu önlemek için bol su içmeye devam etmeli.',
    isBot: true,
  },
  'ateş': {
    response: 'Normal vücut ısısı:\n• Kedi: 38-39.2°C\n• Köpek: 38-39.2°C\n\n39.5°C üzeri ateş varsa:\n• Soğuk suyla ıslak havluyla silme\n• Bol su içirme\n• Veterinere götürme\n\nYüksek ateş ciddi enfeksiyon belirtisi olabilir!',
    isBot: true,
  },
  'kaşıntı': {
    response: 'Kaşıntı nedenleri:\n\n• Pire/kene\n• Alerjik reaksiyon\n• Deri enfeksiyonu\n• Kuru cilt\n\nÇözüm önerileri:\n• Pire/kene ilacı kullanın\n• Mama değiştirmeyi deneyin\n• Aşırı yıkamaktan kaçının\n• Veteriner kontrolü yaptırın',
    isBot: true,
  },
  'tüy dökme': {
    response: 'Tüy dökülmesi normal ama aşırıysa:\n\n• Beslenme eksikliği olabilir\n• Stres faktörü\n• Hormonal sorun\n• Deri hastalığı\n\nÇözümler:\n• Omega-3 içeren mama\n• Düzenli tarama\n• Veteriner kontrolü',
    isBot: true,
  },
  'iştahsızlık': {
    response: 'İştahsızlık nedenleri:\n\n• Diş problemleri\n• Mide rahatsızlığı\n• Stres\n• Ağız yarası\n\n24 saatten fazla süren iştahsızlıkta veteriner kontrolü önemli!\n\nSu tüketimini mutlaka takip edin.',
    isBot: true,
  },
  'default': {
    response: 'Bu konuda size yardımcı olamıyorum. Lütfen daha spesifik bir soru sorun veya aşağıdaki hızlı yanıtlardan birini seçin.',
    isBot: true,
  },
};

// Hızlı yanıt butonları
const QUICK_REPLIES = [
  { id: 1, label: '🐱 Kedi', value: 'kedi' },
  { id: 2, label: '🐕 Köpek', value: 'köpek' },
];

const SYMPTOM_REPLIES = [
  { id: 3, label: '🤢 Kusma', value: 'kusma' },
  { id: 4, label: '💩 İshal', value: 'ishal' },
  { id: 5, label: '🌡️ Ateş', value: 'ateş' },
  { id: 6, label: '😿 Kaşıntı', value: 'kaşıntı' },
  { id: 7, label: '🪮 Tüy Dökme', value: 'tüy dökme' },
  { id: 8, label: '🍽️ İştahsızlık', value: 'iştahsızlık' },
];

const ChatbotScreen = () => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Merhaba! Ben PawAI, hayvan dostlarımıza yardım asistanınızım.\n\nSize nasıl yardımcı olabilirim?',
      isBot: true,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 2,
      text: 'Öncelikle, hayvanın türünü seçer misin?',
      isBot: true,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [animalType, setAnimalType] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Her yeni mesajda scroll'u en alta götür
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Kural tabanlı yanıt oluştur
    setTimeout(() => {
      const botResponse = generateResponse(inputText.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    Keyboard.dismiss();
  };

  const handleQuickReply = (value) => {
    const userMessage = {
      id: messages.length + 1,
      text: value.charAt(0).toUpperCase() + value.slice(1),
      isBot: false,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);

    // Hayvan türünü ayarla
    if (value === 'kedi' || value === 'köpek') {
      setAnimalType(value);
    }

    // Bot yanıtı
    setTimeout(() => {
      const response = RULE_BASED_RESPONSES[value] || RULE_BASED_RESPONSES['default'];
      const botMessage = {
        id: messages.length + 2,
        text: response.response,
        isBot: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const generateResponse = (userInput) => {
    // Anahtar kelimelere göre yanıt üret
    for (const key in RULE_BASED_RESPONSES) {
      if (userInput.includes(key)) {
        return RULE_BASED_RESPONSES[key].response;
      }
    }
    return RULE_BASED_RESPONSES['default'].response;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🐾</Text>
        </View>
        <Text style={styles.headerTitle}>PawAI</Text>
        <Text style={styles.headerSubtitle}>Hayvan Yardım Asistanı</Text>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.isBot ? styles.botMessageWrapper : styles.userMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isBot ? styles.botBubble : styles.userBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isBot ? styles.botText : styles.userText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.isBot ? styles.botTime : styles.userTime,
                  ]}
                >
                  {message.time}
                </Text>
              </View>
            </View>
          ))}

          {/* Hızlı Yanıtlar */}
          {!animalType && (
            <View style={styles.quickRepliesContainer}>
              {QUICK_REPLIES.map((reply) => (
                <TouchableOpacity
                  key={reply.id}
                  style={styles.quickReplyButton}
                  onPress={() => handleQuickReply(reply.value)}
                >
                  <Text style={styles.quickReplyText}>{reply.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {animalType && (
            <View style={styles.quickRepliesContainer}>
              {SYMPTOM_REPLIES.map((reply) => (
                <TouchableOpacity
                  key={reply.id}
                  style={styles.quickReplyButton}
                  onPress={() => handleQuickReply(reply.value)}
                >
                  <Text style={styles.quickReplyText}>{reply.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Area + Disclaimer (sabit altta) */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(SPACING.sm, insets.bottom * 0.5) }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Belirtileri anlat... (örn: iştahsız, kusma)"
              placeholderTextColor="#999"
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>
            PawAI hata yapabilir. Önemli bilgileri kontrol edin.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CHAT_BG,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: CHAT_BG,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: CHAT_BG,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  botMessageWrapper: {
    alignSelf: 'flex-start',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 6,
  },
  botBubble: {
    backgroundColor: '#FFF4E6',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  botText: {
    color: '#1A1A1A',
  },
  userText: {
    color: '#1A1A1A',
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  botTime: {
    color: '#999',
  },
  userTime: {
    color: '#999',
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  quickReplyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FF8C42',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickReplyText: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: CHAT_BG,
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: '#B8976C',
    textAlign: 'center',
    marginTop: 8,
    paddingBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 15,
    maxHeight: 100,
    color: '#1A1A1A',
    marginTop: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export default ChatbotScreen;
