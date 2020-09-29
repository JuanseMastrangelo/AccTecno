import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

import Carousel from './Slideshow/Main';
import { connect } from 'react-redux';
import { Button } from '@ui-kitten/components';
import { useFonts } from 'expo-font';

import { CategoriesComponent } from '../../components/shop/categories';
import { CategoryComponent } from '../../components/shop/category';
import { ScrollView } from 'react-native-gesture-handler';

import { SlideImages, Coupon, ProductBestSellers } from '../../demoData';

const { width } = Dimensions.get('window');

export default class Home extends React.Component<any> {

    constructor(props: any) {
        super(props)
        this.props.navigation.setOptions({ title: 'ACCTECNO' })
    }
    
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <Carousel data={SlideImages}/>
                <CategoriesComponent></CategoriesComponent>
                <CategoryComponent title="Más Vendidos" data={ProductBestSellers}></CategoryComponent>
                <Image source={{uri: Coupon}} resizeMode="contain" style={{width, height: 140, marginVertical: 40}}></Image>
                <CategoryComponent title="Nuevos" data={ProductBestSellers}></CategoryComponent>
            </ScrollView>
        )
    }
}

  