// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import NfcManager, { NfcTech } from 'react-native-nfc-manager';

// NfcManager.start();

// export default function NFCScreen() {
//     async function performHaloInteraction() {
//         try {
//             await NfcManager.requestTechnology([NfcTech.IsoDep,
//             NfcTech.Ndef,
//             NfcTech.NfcA,
//             NfcTech.NfcB,
//             NfcTech.NfcF,
//             NfcTech.NfcV,
//             NfcTech.Iso15693IOS,
//             NfcTech.Iso15693IOS,
//             NfcTech.FelicaIOS,
//             NfcTech.MifareUltralight,
//             NfcTech.MifareIOS]);
//             const tag = await NfcManager.getTag();
//             const s = JSON.stringify(tag)
//             alert(`NFC tag has been scanned:  ${s}`);
//         } catch (ex) {
//             console.warn("Oops!", JSON.stringify(ex));
//         } finally {
//             // stop the nfc scanning
//             NfcManager.cancelTechnologyRequest();
//         }
//     }

//     return (
//         <View style={styles.container}>
//             <Text>Click on the button and then scan the NFC tag. Results will appear in the console.</Text>
//             <TouchableOpacity style={{ padding: 100, backgroundColor: '#FF00FF' }} onPress={performHaloInteraction}>
//                 <Text>Click here and tap the tag</Text>
//             </TouchableOpacity>
//             {/* <StatusBar style="auto" /> */}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default NFCScreen;

