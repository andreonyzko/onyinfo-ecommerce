import { createBrowserRouter } from 'react-router'
import { RootLayout } from '../components/layout/RootLayout'
import { HomePage } from '../pages/Home'
import { CategoryPage } from '../pages/CategoryPage'
import { ProductPage } from '../pages/ProductPage'
import { SearchPage } from '../pages/SearchPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { HowIDidPage } from '../pages/HowIDidPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import {
  rootLoader,
  homeLoader,
  categoryLoader,
  productLoader,
  searchLoader,
} from './loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    loader: rootLoader,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: 'categoria/:slug',
        element: <CategoryPage />,
        loader: categoryLoader,
      },
      {
        path: 'produto/:slug',
        element: <ProductPage />,
        loader: productLoader,
      },
      {
        path: 'busca',
        element: <SearchPage />,
        loader: searchLoader,
      },
      {
        path: 'carrinho',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'como-fiz',
        element: <HowIDidPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
