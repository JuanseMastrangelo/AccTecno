import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

export class CartIcon extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }
    
    goToCart() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Carro'}));
    }


    render() {
        return (
            <TouchableOpacity style={{ alignSelf: 'center', height: '100%', marginBottom: 10, alignItems: 'flex-end'}}
            onPress={() => this.goToCart()}>
                <Image
                    source={{uri: 'https://icons.iconarchive.com/icons/iconsmind/outline/512/Shopping-Cart-icon.png'}}
                    fadeDuration={0}
                    style={[styles.iconBag, this.props.style]}
                />
                <View style={[styles.badge, this.props.styleBadge]}>
                    <Text style={{ color: '#FFF' }}>{this.props.state.cart.items.length}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    iconBag: {
        width: 25,
        height: 21,
        marginRight: 10
    },
    badge: {
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10000,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 0
    }
})


function mapStateToProps(state: any) {
    return {state}
  }
  
export default connect(mapStateToProps)(CartIcon)
  