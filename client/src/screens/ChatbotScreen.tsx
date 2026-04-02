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
import api from '../services/api';

const CHAT_BG = '#F8F8F8';

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

type ChatMessage = {
  id: string;
  text: string;
  isBot: boolean;
  time: string;
};

type ChatbotResponse = {
  reply?: string;
  animal_type?: string | null;
  require_animal_type_selection?: boolean;
  quick_replies?: string[];
};

const ChatbotScreen = (): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Merhaba! Ben PawAI, hayvan dostlarımıza yardım asistanınızım.\n\nSize nasıl yardımcı olabilirim?',
      isBot: true,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: '2',
      text: 'Öncelikle, hayvanın türünü seçer misin?',
      isBot: true,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [animalType, setAnimalType] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState(QUICK_REPLIES);
  const [requireAnimalTypeSelection, setRequireAnimalTypeSelection] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    // Her yeni mesajda scroll'u en alta götür
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const createMessage = (text: string, isBot: boolean): ChatMessage => ({
    id: `${Date.now()}-${Math.random()}`,
    text,
    isBot,
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
  });

  const buildChatHistory = (existingMessages: ChatMessage[], nextUserText: string) => {
    const history = existingMessages
      .slice(-10)
      .map((message) => ({
        role: message.isBot ? 'assistant' : 'user',
        content: message.text,
      }));

    return [...history, { role: 'user', content: nextUserText }];
  };

  const syncQuickReplies = (responseData: ChatbotResponse | undefined, nextAnimalType: string | null) => {
    const shouldRequireAnimalType = Boolean(responseData?.require_animal_type_selection);
    const backendQuickReplies = responseData?.quick_replies ?? [];

    setRequireAnimalTypeSelection(shouldRequireAnimalType);

    if (shouldRequireAnimalType && backendQuickReplies.length > 0) {
      setQuickReplies(
        backendQuickReplies.map((reply, index) => ({
          id: index + 1,
          label: reply === 'kedi' ? '🐱 Kedi' : reply === 'köpek' ? '🐕 Köpek' : reply,
          value: reply,
        })),
      );
      return;
    }

    if (nextAnimalType) {
      setQuickReplies(SYMPTOM_REPLIES);
      return;
    }

    setQuickReplies(QUICK_REPLIES);
  };

  const sendMessage = async (text: string, forcedAnimalType: string | null = null) => {
    if (!text.trim() || isSending) {
      return;
    }

    const userMessage = createMessage(text, false);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInputText('');
    setIsSending(true);
    Keyboard.dismiss();

    try {
      const response = await api.post('/chat/respond', {
        message: text,
        animal_type: forcedAnimalType ?? animalType,
        messages: buildChatHistory(messages, text),
      });

      const data = response?.data;
      const nextAnimalType =
        data?.require_animal_type_selection
          ? null
          : (data?.animal_type ?? forcedAnimalType ?? animalType);

      const botMessage = createMessage(
        data?.reply ?? 'Bir hata oluştu. Lütfen tekrar deneyin.',
        true,
      );

      setAnimalType(nextAnimalType);
      syncQuickReplies(data, nextAnimalType);
      setMessages((prev) => [...prev, botMessage]);
    } catch (_error) {
      const botMessage = createMessage(
        'Mesaj işlenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
        true,
      );
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    void sendMessage(inputText);
  };

  const handleQuickReply = (value: string) => {
    const forcedAnimalType =
      value === 'kedi' || value === 'köpek' ? value : null;

    void sendMessage(value, forcedAnimalType);
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
          {requireAnimalTypeSelection && (
            <View style={styles.quickRepliesContainer}>
              {quickReplies.map((reply) => (
                <TouchableOpacity
                  key={reply.id}
                  style={styles.quickReplyButton}
                  onPress={() => handleQuickReply(reply.value)}
                  disabled={isSending}
                >
                  <Text style={styles.quickReplyText}>{reply.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!requireAnimalTypeSelection && animalType && (
            <View style={styles.quickRepliesContainer}>
              {quickReplies.map((reply) => (
                <TouchableOpacity
                  key={reply.id}
                  style={styles.quickReplyButton}
                  onPress={() => handleQuickReply(reply.value)}
                  disabled={isSending}
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
              style={[
                styles.sendButton,
                (!inputText.trim() || isSending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isSending}
            >
              <Text style={styles.sendIcon}>{isSending ? '...' : '➤'}</Text>
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
