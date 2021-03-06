import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import CarouselSingleProduct from './Slideshow/Main';
import Colors from '../../constants/Colors';

import { CategoryComponent } from '../shop/category';
const { width } = Dimensions.get('window');


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actionsCart } from '../../utils/actions/cart';
import { actionCreators as actionsFavorites } from '../../utils/actions/favorite';


import { Spinner, Toast } from 'native-base';
import { authKey, urlApi } from '../../constants/KeyConfig';
import { HttpService } from '../../constants/HttpService';
import AsyncStorage from '@react-native-community/async-storage';


class SingleProduct extends React.Component<any, any> {
    httpService: any = null;
    constructor(props: any) {
        super(props)
        this.state = {
            product: this.props.route.params.product,
            relatedProducts: null,
            loading: false
        }
        this.loadProductByCategorie();
        this.httpService = new HttpService();
    }

    goToDescription = () => {
        const { product } = this.state;
        this.props.navigation.navigate('Description', { product });
    }
    goToComments = () => {
        this.props.navigation.navigate('Comments');
    }

    toggleFavorite = () => {
        const { product } = this.state;
        let { items } = this.props.state.favorites;
        const is_favorite = items.filter((el: any) => el.id === product.id).length > 0;
        this.httpService.post('/favorites', {postId: product.id}).then((_:any) => {
            Toast.show({
                text: is_favorite ? 'Eliminado de favorito' : 'Agregado a favorito',
                type: 'success',
                position: 'top'
            })

            if (is_favorite) { // Si es favorito, lo eliminamos de la lista
                this.props.favoriteRemove(product.id);
            } else {
                this.props.favoriteAdd(product);
            }
        });
    }

    loadProductByCategorie = async() => {
        const { product } = this.state;
        const userData = await AsyncStorage.getItem(authKey)
        const userId = JSON.parse(userData!).token;
        const header = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ userId,
        });
        this.httpService.get('/products/categorie/' + product.categorieId, header).then((res: any) => res.json()).then((relatedProducts: any) => {
            this.setState({relatedProducts});
        });
    }

    addToCart = async () => {
        const { product } = this.state;
        this.setState({loading: true});
        this.httpService.post('/cart', {postId: product.id}).then((_:any) => {
            this.props.addCart(product);
            this.setState({loading: false});
        })
    }

    removeToCart = () => {
        const { product } = this.state;
        this.setState({loading: true});
        this.httpService.delete('/cart/'+product.id).then((_:any) => {
            this.props.cartRemove(product.id);
            this.setState({loading: false});
        });
    }


    render() {
        const { product, relatedProducts, loading } = this.state;
        const { items } = this.props.state.cart;
        const in_cart_item = items.filter((el: any) => el.id === product.id).length > 0;


        const favItems = this.props.state.favorites.items;
        const is_favorite = favItems.filter((favItem: any) => favItem.id === product.id).length > 0;
        return (
            <View style={{paddingBottom: 50}}>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <CarouselSingleProduct data={JSON.parse(product.files)} id={product.id} />
                    <View style={{ marginTop: 10, paddingVertical: 10, paddingHorizontal: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 }}>
                            <Text style={{ color: Colors.default.greyColor, fontSize: 13, fontFamily: 'Poppins-Regular' }}>SAMSUNG | CELULAR</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <Text style={{ color: Colors.default.darkColor, fontFamily: 'Poppins-Regular', fontSize: 10 }}>(1)</Text>
                                
                                <TouchableOpacity style={{marginLeft: 20}} onPress={() => this.toggleFavorite()}>
                                    <FontAwesome size={23} name={is_favorite ? 'heart' : 'heart-o'} color={is_favorite ? Colors.default.accentColor : Colors.default.greyColor}></FontAwesome>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ marginVertical: 5 }}>
                            <Text style={{ fontSize: 24, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>{product.title}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, marginVertical: 0 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>$ {product.saleValue}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons size={25} name="md-checkmark" color={Colors.default.green} style={{ marginRight: 8 }}></Ionicons>
                                <Text style={{ color: Colors.default.green, fontFamily: 'Poppins-Regular', fontSize: 15 }}>{product.count} en stock</Text>
                            </View>
                        </View>

                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>Sku: 123123</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: Colors.default.greyColor, marginTop: 5 }}>
                            {product.description}
                        </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, marginVertical: 10,
                            paddingVertical: 5, borderBottomColor: 'rgba(200,200,200,.3)', borderBottomWidth: 1
                        }}>
                            <Text onPress={() => this.goToDescription()} style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold', width }}>Descripción</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons size={25} name="md-arrow-dropright" color={Colors.default.primaryColor} style={{ marginRight: 8 }}></Ionicons>
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 }}>
                            <Text onPress={() => this.goToComments()} style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold', width }}>Comentarios</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons size={25} name="md-arrow-dropright" color={Colors.default.primaryColor} style={{ marginRight: 8 }}></Ionicons>
                            </View>
                        </View>
                    </View>
                    {
                        relatedProducts ?
                        <CategoryComponent navigation={this.props.navigation} title="Productos relacionados" data={relatedProducts}></CategoryComponent>
                        :
                        <View><Spinner color="black" size={20}></Spinner></View>
                    }
                </ScrollView>
                {
                    !in_cart_item ?
                    <View style={{ position: 'absolute', bottom: 10, left: 0, width, paddingHorizontal: 20 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.default.primaryColor, width: '100%', flexDirection: 'row', height: 50,
                                justifyContent: 'center', alignItems: 'center', borderRadius: 5
                            }}
                            disabled={loading}
                            onPress={() => this.addToCart()}>
                            <FontAwesome name="shopping-cart" color="white" size={17} style={{ marginRight: 15 }}></FontAwesome>
                            
                            {
                                !loading ?
                                <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>Agregar al carro</Text>
                                :
                                <Spinner color="white" size={20}></Spinner>
                            }
                        </TouchableOpacity>
                    </View>
                    :
                    
                    <View style={{ position: 'absolute', bottom: 10, right: 0, width: width*0.5, paddingHorizontal: 20 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.default.accentColor, width: '100%', flexDirection: 'row', height: 50,
                                justifyContent: 'center', alignItems: 'center', borderRadius: 5
                            }}
                            disabled={loading}
                            onPress={() => this.removeToCart()}>
                            <FontAwesome name="shopping-cart" color="white" size={17} style={{ marginRight: 15 }}></FontAwesome>
                            {
                                !loading ?
                                <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>Quitar</Text>
                                :
                                <Spinner color="white" size={20}></Spinner>
                            }
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}


function mapDispatchToProps(dispatch: any) {
    return {
        cartRemove: bindActionCreators(actionsCart.removeProduct, dispatch),
        addCart: bindActionCreators(actionsCart.addProduct, dispatch),
        favoriteAdd: bindActionCreators(actionsFavorites.favoriteAdd, dispatch),
        favoriteRemove: bindActionCreators(actionsFavorites.favoriteRemove, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)