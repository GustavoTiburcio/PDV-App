/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get("window");
//const height = width * 0.7; //70%

const Slider = (props) => {

    const [open, setOpen] = useState(false);
    const [uri, setUri] = useState(null);
    const [active, setActive] = useState(0);

    function Fotos() {
        if (props.fotos.length > 0) {
            return props.fotos.map((item, i) => {
                return (
                    <View key={i}>
                        <TouchableWithoutFeedback onPress={() => {
                            setOpen(true)
                            setUri('https://' + item.linkfot)
                        }}>
                            <Image
                                style={styles.image}
                                source={{ uri: 'https://' + item.linkfot }}
                            />
                        </TouchableWithoutFeedback>
                        {uri &&
                            <Modal
                                animationType='fade'
                                transparent={false}
                                visible={open}
                                onRequestClose={() => {
                                    setOpen(!open)
                                }}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 0 }}>
                                    <Image
                                        style={{ width: '100%', height: '80%', borderRadius: 10 }}
                                        source={{ uri: uri }}
                                    />
                                    <View flexDirection={'row'}>
                                        <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpen(false)}>
                                            <FontAwesome name="window-close" size={50} color='#FF0000' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        }
                    </View >
                )
            })
        }
        return;
    }


    const change = (nativeEvent) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if (slide !== active) {
            setActive(slide);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                pagingEnabled
                horizontal
                onScroll={(e) => change(e.nativeEvent)}
                style={styles.container}
                showsHorizontalScrollIndicator={false}
            >
                <Fotos />
            </ScrollView>
            <View style={styles.pagination}>
                {
                    props.fotos.map((i, k) => (
                        <Text key={k} style={k == active ? styles.pagingActiveText : styles.pagingText}>•</Text>
                    ))
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        height: '35%',
        marginTop: '2%'
    },
    image: {
        width, height: '90%',
        resizeMode: 'contain',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
    pagingText: {
        color: '#888',
        fontSize: 60,
        margin: 3
    },
    pagingActiveText: {
        color: '#FFF',
        fontSize: 60,
        margin: 3
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        margin: 20,
        borderRadius: 10,
        height: 50
    }
});
export default Slider;