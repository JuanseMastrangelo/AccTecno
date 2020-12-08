import { FontAwesome } from '@expo/vector-icons';
import { Spinner } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

export class ColumnGridViewComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.props.navigation.setOptions({ title: this.props.route.params.title })
        
        this.state = {
            categorie: this.props.route.params.categorie,
            products: null,
        }
    }

    componentDidMount() {
        this.loadProductByCategorie();
    }

    loadProductByCategorie = async() => {
        const { categorie } = this.state;
        let productsFetch = await fetch('https://softwareargentina.store/api/products/categorie/' + categorie.id);
        const products = await productsFetch.json();
        this.setState({products});
    }

    goToProduct = (item: any) => {
        this.props.navigation.navigate('SingleProduct', { product: item });
    }

    renderItem = (item: any, index: number) => {
        return (
            <TouchableOpacity
                style={{ width: width / 2.3, marginTop: 10, height: 280, marginHorizontal: 10, borderWidth: 1, borderColor: 'rgba(200,200,200,.2)', backgroundColor: 'white' }}
                onPress={() => this.goToProduct(item)}>
                <Image source={{ uri: JSON.parse(this.state.products[index].files)[0].path }} style={{ width: '100%', height: '70%', borderRadius: 10 }}></Image>
                <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, }}>{item.title}</Text>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold' }}>$ {item.saleValue}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {[...Array(item.rating)].map((x, i) =>
                            <FontAwesome name="star" color="#F7D970"></FontAwesome>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { products } = this.state
        return (
            <View style={{ marginVertical: 80, minHeight: height }}>
                
                {
                    products ? 
                    products.length > 0 ?
                        <FlatList
                            data={products}
                            horizontal={false}
                            renderItem={({item, index}) => this.renderItem(item, index)}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                        />
                    :
                    <Text style={{textAlign: 'center'}}>No se han encontrado productos</Text>
                :
                <View><Spinner color="black" size={20}></Spinner></View>
                }
            </View>
        )
    }
}

