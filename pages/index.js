import styles from '../styles/Index.module.css'
import Head from "next/head";
import Link from "next/link";
import routes from '../assets/routes.json';

export default function Index(props) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Die Legendäre Liste</title>
        <meta name="description" content="Eine Liste von den legendärsten aller legendären Sachen"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Die <span>Legendäre</span> Liste
        </h1>
        <div className={styles.container}>
          {Object.keys(routes).map((route) => {

            const site = routes[route];

            return (
              <Link href={`/${route}`} key={site}>
                <a>
                  <div className={styles.item}>
                    <h2>{site} &rarr;</h2>
                  </div>
                </a>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )

}
