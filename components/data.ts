import { StaticImageData } from 'next/image'
import img1 from '../public/1.jpg'
import img2 from '../public/2.jpg'
import img3 from '../public/3.jpg'
import img4 from '../public/4.jpg'

export const data: [image:StaticImageData, text: string][] = [
    [img1, 'Price and other details may vary based on product size and color. THIS IS 0'],
    [img2, 'Price and other details may vary based on product size and color. THIS IS 1'],
    [img3, 'Price and other details may vary based on product size and color. THIS IS 2'],
    [img4, 'Price and other details may vary based on product size and color. THIS IS 3'],
]