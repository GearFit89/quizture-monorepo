import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";

import { useStyleTarget } from "@/hooks";




export default function HomePage() {
    const { styles } = useStyleTarget("home")

    return (
        
            <View>
            <Text>
                This is an app! 
                {"\nWelcome to the home screen!!\n"}
               

            </Text>
            <Pressable style= { ({pressed})=>({
                ...styles.title,
               
                backgroundColor: pressed ? "red" : "blue",
                   


            }) }>
                <Text>Hi</Text>
            </Pressable>
         
           
            </View>
            
        
    )

    
}