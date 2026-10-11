// import { ScrollView, Text, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useProfileMockContent } from '@/hooks'
// import { useStyleTarget } from '@/hooks'

// export default function ProfileMockPage () {
//   const content = useProfileMockContent()
//   const { styles: shared } = useStyleTarget('mockPages')
//   const { styles } = useStyleTarget('profileMock')

//   return (
//     <SafeAreaView style={shared.screen} edges={['top', 'left', 'right']}>
//       <ScrollView contentContainerStyle={shared.content}>
//         <View>
//           <Text style={shared.eyebrow}>{content.eyebrow}</Text>
//           <Text accessibilityRole='header' style={shared.title}>{content.title}</Text>
//           <Text style={shared.subtitle}>{content.subtitle}</Text>
//           <Text style={shared.preview}>{content.preview}</Text>
//         </View>
//         {/* <View style={styles.hero}> */}
//           <Text style={styles.season}>{content.season}</Text>
//           <View style={shared.row}>
//             <View style={styles.avatar}><Text style={styles.initials}>{content.initials}</Text></View>
//             <View style={shared.rowText}>
//               <Text style={styles.name}>{content.name}</Text>
//               <Text style={styles.team}>{content.team}</Text>
//             </View>
//           </View>
//           <View style={styles.badge}><Text style={styles.badgeText}>{content.level}</Text></View>
//           <View style={styles.stats}>
//             {content.stats.map((stat) => (
//               <View key={stat.label} style={styles.stat}>
//                 <Text style={styles.statValue}>{stat.value}</Text>
//                 <Text style={styles.statLabel}>{stat.label}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//         <View style={shared.card}>
//           <View>
//             <Text accessibilityRole='header' style={shared.sectionTitle}>{content.progressTitle}</Text>
//             <Text style={shared.description}>{content.progressSubtitle}</Text>
//           </View>
//           <Text style={shared.label}>{content.book}</Text>
//           <View style={styles.progressRow}>
//             <Text style={shared.description}>{content.progressLabel}</Text>
//             <Text style={styles.goal}>{content.progressPercent}</Text>
//           </View>
//           <View accessible accessibilityRole='progressbar' accessibilityLabel={content.progressLabel} accessibilityValue={{ min: 0, max: 100, now: 75 }} style={styles.progressTrack}>
//             <View style={styles.progressFill} />
//           </View>
//           <Text style={styles.goal}>{content.goal}</Text>
//         </View>
//         <View style={shared.card}>
//           <View>
//             <Text accessibilityRole='header' style={shared.sectionTitle}>{content.achievementsTitle}</Text>
//             <Text style={shared.description}>{content.achievementsSubtitle}</Text>
//           </View>
//           {content.achievements.map((achievement) => (
//             <View key={achievement.title} style={shared.row}>
//               <Text accessible={false} style={shared.icon}>{achievement.symbol}</Text>
//               <View style={shared.rowText}>
//                 <Text style={shared.label}>{achievement.title}</Text>
//                 <Text style={shared.description}>{achievement.description}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//         <View style={shared.card}>
//           <Text accessibilityRole='header' style={shared.sectionTitle}>{content.activityTitle}</Text>
//           {content.activity.map((activity) => (
//             <View key={activity.title} style={shared.row}>
//               <View style={shared.rowText}>
//                 <Text style={shared.label}>{activity.title}</Text>
//                 <Text style={shared.description}>{activity.detail}</Text>
//               </View>
//               <Text style={styles.score}>{activity.score}</Text>
//             </View>
//           ))}
//         </View>
//         <View style={styles.encouragement}><Text style={styles.encouragementText}>{content.encouragement}</Text></View>
//         <Text style={shared.footer}>{content.footer}</Text>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }
