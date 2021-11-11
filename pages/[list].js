import styles from '../styles/[list].module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from 'next/link';
import useSWR from 'swr';
import Head from "next/head";
import routes from "../assets/routes.json";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function List(props) {

  const router = useRouter();
  const listRoute = router.query.list;
  const listName = routes[listRoute];

  const [value, setValue] = useState('');
  const {data, error} = useSWR( `/api/item?list=${listRoute || ''}`, fetcher);

  // redirect user if list not exists
  useEffect(() => {
    if (!listName && listRoute) {
      router.push('/');
    }
  }, [listName, listRoute, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Die Legendäre {listName} Liste</title>
        <meta name="description" content="Eine Liste von den legendärsten aller legendären Sachen"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main>
        <h1 className={styles.title}>Die Legendäre <span>{listName}</span> Liste</h1>
        <div className={styles.textInputContainer}>
          <div>
            <input
              type={'text'}
              placeholder={'Neuer Eintrag'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              onClick={value ? () => {
                //setItems([...items, value]);
                fetch('/api/item', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name: value,
                    list: listRoute,
                  }),
                }).then(() => {
                  window.location.reload();
                })
                setValue('');
              } : null}
              className={value ? styles.enabledButton : styles.disabledButton}
            >
              Senden
            </button>
          </div>
        </div>
        {data ? data.map((item, index) =>
          <div key={item.name + index} className={styles.item}>
            {item.name}
          </div>
        ) : null}
        <div style={{height: '1rem',}}/>
        <Link href={'/'}>
          <a>
            <div className={styles.backToMain}>Zur Startseite</div>
          </a>
        </Link>
      </main>
    </div>
  )
}
