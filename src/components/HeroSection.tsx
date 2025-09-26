import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  Surface,
  Title,
  Paragraph,
  Button,
  useTheme,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export interface HeroSectionProps {
  style?: any;
  onGetStarted?: () => void;
}

const benefits = [
  {
    icon: 'psychology',
    title: 'AI project suggestions',
    desc: 'Turn your components into smart, build-ready ideas.',
    color: '#6366f1',
  },
  {
    icon: 'track-changes',
    title: 'Tailored to skill level',
    desc: 'From beginner to advanced, projects match your pace.',
    color: '#8b5cf6',
  },
  {
    icon: 'folder-special',
    title: 'Organize and track',
    desc: 'Save, categorize, and refine your project ideas.',
    color: '#06b6d4',
  },
];

export default function HeroSection({ style, onGetStarted }: HeroSectionProps) {
  const theme = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }, style]}
      showsVerticalScrollIndicator={false}
    >
      {/* Main Hero Section */}
      <Surface style={[styles.heroCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.heroContent}>
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Icon name="auto-awesome" size={16} color={theme.colors.primary} />
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
              AI-powered STEM projects
            </Text>
          </View>

          {/* Title */}
          <Title style={[styles.heroTitle, { color: theme.colors.text }]}>
            Turn electronic components into buildable project ideas
          </Title>

          <Paragraph style={[styles.heroDescription, { color: theme.colors.onSurface }]}>
            Atal Idea Generator helps you explore, tailor, and organize STEM projects. Add your
            parts—resistors, sensors, microcontrollers—and instantly get ideas that fit your goals
            and experience.
          </Paragraph>

          {/* Get Started Button */}
          <Button
            mode="contained"
            onPress={onGetStarted}
            style={styles.getStartedButton}
            contentStyle={styles.buttonContent}
            icon="rocket-launch"
          >
            Get Started
          </Button>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <Icon name="memory" size={16} color={theme.colors.onSurface} />
            <Text style={[styles.quickInfoText, { color: theme.colors.onSurface }]}>
              No setup needed — just list your components
            </Text>
          </View>
        </View>
      </Surface>

      {/* Benefits Section */}
      <View style={styles.benefitsContainer}>
        <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Why Choose Atal Ideas?
        </Title>
        
        {benefits.map((benefit, index) => (
          <Card 
            key={index} 
            style={[styles.benefitCard, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <View style={styles.benefitContent}>
                <View style={[styles.benefitIcon, { backgroundColor: `${benefit.color}20` }]}>
                  <Icon name={benefit.icon} size={24} color={benefit.color} />
                </View>
                <View style={styles.benefitText}>
                  <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>
                    {benefit.title}
                  </Text>
                  <Text style={[styles.benefitDescription, { color: theme.colors.onSurface }]}>
                    {benefit.desc}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Visual Demo Section */}
      <Surface style={[styles.demoSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.demoContent}>
          <View style={styles.demoHeader}>
            <Icon name="rocket-launch" size={20} color={theme.colors.primary} />
            <Text style={[styles.demoHeaderText, { color: theme.colors.primary }]}>
              From parts to projects
            </Text>
          </View>
          
          <View style={styles.exampleBox}>
            <Text style={[styles.exampleTitle, { color: theme.colors.text }]}>
              Smart matches from your components
            </Text>
            <Text style={[styles.exampleDescription, { color: theme.colors.onSurface }]}>
              Example: HC-SR04 + Arduino + Buzzer → Parking assist, water level meter, or distance alarm.
            </Text>
          </View>
        </View>
      </Surface>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  getStartedButton: {
    marginBottom: 16,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickInfoText: {
    fontSize: 12,
    marginLeft: 6,
  },
  benefitsContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  benefitContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  demoSection: {
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  demoContent: {
    padding: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  demoHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  exampleBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});