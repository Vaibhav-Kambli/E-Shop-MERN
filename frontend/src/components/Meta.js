import React from 'react'
import {Helmet} from "react-helmet";


const Meta = ({title, description, keywords}) => {
    return (
        <Helmet>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta name="keywords" content={keywords}/>
            
        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'Welcome to E-Shop',
    keywords: 'electronics, buy electronics, affordable electronics',
    description: 'We sell products the best products for reasonable prices'
}

export default Meta
