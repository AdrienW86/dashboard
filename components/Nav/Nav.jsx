import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/title.png'
import styles from './nav.module.css'

export default function Nav() {
  return (
    <div>
      <section className={styles.title}>           
        <Image
          src={Logo}
          height={100}
          width={350}
          priority
          className={styles.logo}
          alt='titre'
        />              
      </section>
            <div className={styles.nav}>
                <Link href='/home' className={styles.link}> Accueil </Link>
                <Link href='/commande' className={styles.link} > Expédition </Link>
                <Link href='/stock' className={styles.link} > Stock </Link>
            </div>
            
    </div>
  )
}
