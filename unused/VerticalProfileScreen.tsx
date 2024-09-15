import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';

// import {Sounding, ThermodynamicDiagram } from 'meteojs';
// const meteojs = require('meteojs');

// import meteojs from 'meteojs'

import {
    Sounding
} from 'meteojs/Sounding';
import { ThermodynamicDiagram } from 'meteojs/ThermodynamicDiagram';
var sounding = new Sounding();
sounding.addLevel({
    pres: 1000,
    hght: 100,
    tmpk: 19,
    dwpk: 17,
    wdir: 45,
    wspd: 6
});
// console.log(sounding)
// https://github.com/chird/meteoJS/issues/61#issu/ ecomment-1156119499
// td.addSounding(sounding);
//             {/* <Text>Vertcial Profile Screen</Text> */}

// import React, { useRef, useEffect } from 'react';

// function VertcialProfileScreen() {
//     const myDivRef = useRef(null);

//     useEffect(() => {
//         // Access the DOM node here
//         if (myDivRef.current) {
//             console.log(myDivRef.current); // This will give you the DOM node
//              const td = new ThermodynamicDiagram({ renderTo: myDivRef.current });

//         }
//     }, []); // Empty dependency array means this runs once on mount

//     return (
//         <View>
//             <View ref={myDivRef}>
//                 {/* Your content here */}
//             </View>
//         </View>
//     );
// }

// let td: any;
// const VertcialProfileScreen = () => {

//     const myDivRef = useRef(null);

//     useEffect(() => {
//         // Access the DOM node here
//         if (myDivRef.current) {
//             console.log(myDivRef.current); // This will give you the DOM node
//             const td = new ThermodynamicDiagram({ renderTo: this.myDivRef.current });
//         }
//     }, []); // Empty dependency array means this runs once on mount


//     // constructor(props) {
//     //     super(props);
//     //     this.myDivRef = React.createRef();
//     // }

//     // componentDidMount() {
//     //     // Access the DOM node here
//     //     console.log(this.myDivRef.current); // This will give you the DOM node
//     //     const td = new ThermodynamicDiagram({ renderTo: this.myDivRef.current });

//     // }

//     // const myRef = useRef(null);
//     // useEffect(() => {
//     //     // Your code to execute when the component is rendered
//     //     console.log("Component has been rendered!");
//     //     console.log(myref);
//     //     // Add your logic here
//     //     const td = new ThermodynamicDiagram({ renderTo: myRef.current });

//     //     // Optional: cleanup function
//     //     return () => {
//     //         // Cleanup code if needed, e.g., for unmounting or when dependencies change
//     //     };
//     // }, []); // The empty dependency array means this effect runs once when the component mounts


//     return (
//         <div ref={myDivRef}>
//             {/* Your content here */}
//         </div>

//         // <View ref={myRef} style={styles.container}>

//         //     { // td = new ThermodynamicDiagram()
//         //     console.log(myRef.current)
//         //     }

//         // </View>
//     );
// };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VertcialProfileScreen;