import styles from '../styles/HeaderNavigation.module.css';
import Link from 'next/link';

export default function HeaderNavigation(props) {

  const sites = [
    {name: 'Essen', route: 'essen'},
    {name: 'Dinge', route: 'dinge'},
    {name: 'Lieder', route: 'lieder'},
    {name: 'Memes', route: 'memes'},
    {name: 'Personen', route: 'personen'},
    {name: 'Wörter', route: 'woerter'},
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Die Legendäre <span>{props.title}</span> Liste
      </h1>
      <nav>
        <ul className={styles.navigation}>
          {sites.map(({name, route}) =>
            <Link href={`/${route}`} key={route}>
              <a>
                <li>{name}</li>
              </a>
            </Link>
          )}
        </ul>

      </nav>
    </div>
  )
}
