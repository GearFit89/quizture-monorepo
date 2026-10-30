// import { Fragment } from 'react'
// import { ScrollView, Text, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useSettingsMockContent } from '@/hooks/content.hook'
// import { useStyleTarget } from '@/hooks/styles.hook'

// export default function SettingsMockPage () {
//   const content = useSettingsMockContent()
//   const { styles: shared } = useStyleTarget('mockPages')
//   const { styles } = useStyleTarget('settingsMock')

//   return (
//     <SafeAreaView style={shared.screen} edges={['top', 'left', 'right']}>
//       <ScrollView contentContainerStyle={shared.content}>
//         <View>
//           <Text style={shared.eyebrow}>{content.eyebrow}</Text>
//           <Text accessibilityRole='header' style={shared.title}>{content.title}</Text>
//           <Text style={shared.subtitle}>{content.subtitle}</Text>
//           <Text style={shared.preview}>{content.preview}</Text>
//         </View>
//         <View style={shared.card}>
//           <Text accessibilityRole='header' style={shared.sectionTitle}>{content.accountTitle}</Text>
//           <View style={shared.row}>
//             <View style={styles.avatar}><Text style={styles.initials}>{content.initials}</Text></View>
//             <View style={shared.rowText}>
//               <Text style={shared.label}>{content.name}</Text>
//               <Text style={shared.description}>{content.accountDetail}</Text>
//             </View>
//           </View>
//         </View>        {content.sections.map((section) => (
//           <View key={section.title} style={shared.card}>
//             <View>
//               <Text accessibilityRole='header' style={shared.sectionTitle}>{section.title}</Text>
//               <Text style={shared.description}>{section.description}</Text>
//             </View>
//             {section.rows.map((row, index) => (
//               <Fragment key={row.label}>
//                 {index > 0 && <View style={shared.divider} />}
//                 <View style={styles.row}>
//                   <Text accessible={false} style={shared.icon}>{row.symbol}</Text>
//                   <View style={shared.rowText}>
//                     <Text style={shared.label}>{row.label}</Text>
//                     <Text style={shared.description}>{row.description}</Text>
//                   </View>
//                   <Text style={styles.value}>{row.value}</Text>
//                 </View>
//               </Fragment>
//             ))}
//           </View>
//         ))}
//         <View>
//           <Text style={styles.footerTitle}>{content.footerTitle}</Text>
//           <Text style={shared.footer}>{content.footer}</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }
