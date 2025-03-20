import React, { useContext } from 'react';

import Layout from './layout';
import CartComp from '../components/CartComp'

const Cart = () => {


    return (
        <Layout>
           <CartComp isAdmin={false}/>
        </Layout>
    );
};

export default Cart;
