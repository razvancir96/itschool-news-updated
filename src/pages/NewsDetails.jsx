import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useFetch } from "../utils/hooks/useFetch";
import { getNewsDetailsEndpoint } from "../api/endpoints";
import { getNewsDetails } from "../api/adaptors";
import Button from "react-bootstrap/Button";
import styles from "./NewsDetails.module.css";
import { getFormattedDate } from "../utils/date";
import { addToFavorites } from "../store/Favorites/actions";
import { FavoritesContext } from "../store/Favorites/context";
// Importam componenta Alert.
import Alert from "react-bootstrap/Alert";
// Importam hook-ul useLocalStorageState.
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

function NewsDetails() {
  const { favoritesDispatch, favoritesState } = useContext(FavoritesContext);
  let { newsId } = useParams();
  newsId = decodeURIComponent(newsId);
  const newsDetailsEndpoint = getNewsDetailsEndpoint(newsId);
  const newsDetails = useFetch(newsDetailsEndpoint);
  const adaptedNewsDetails = getNewsDetails(newsDetails);
  // Adaugam un state pentru afisarea alertei.
  const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);
  // Extragem functia de modificare a localStorage-ului. Nu avem nevoie de state-ul din localStorage, conventia este ca pentru variabile neutilizate sa punem denumirea _.
  // Comentariul eslint-disable-next-line dezactiveaza eslint pentru urmatoarea linie (sa nu se planga ca nu utilizam variabila _).
  // eslint-disable-next-line
  const [_, setLocalStorageState] = useLocalStorage(
    "favorites",
    favoritesState
  );
  // Adaugarea in localStorage este un efect, atunci cand se modifica produsele favorite.
  // Cum strim ca s-au modificat produsele favorite? Primim o noua valoare a lui favoritesState.
  // setLocalStorageState este sugerat sa fie adaugat la dependente de o regula de lining.
  useEffect(() => {
    setLocalStorageState(favoritesState);
  }, [favoritesState, setLocalStorageState]);

  const { title, description, image, date, author, content, thumbnail } =
    adaptedNewsDetails;
  const formattedDate = getFormattedDate(date);

  function handleAddToFavorites(product) {
    const actionResult = addToFavorites(product);
    favoritesDispatch(actionResult);
    // Afisam alerta.
    setIsAlertDisplayed(true);
    // Imediat ce afisam alerta, declansam un timer, care in 2 secunde va ascunde alerta.
    setTimeout(() => {
      setIsAlertDisplayed(false);
    }, 2000);
  }

  return (
    <Layout>
      {/* Afisam conditionat alerta */}
      {isAlertDisplayed && (
        <Alert variant="success" id={styles.alert}>
          Succes! Poți vedea știrea accesând secțiunea Favorite.
        </Alert>
      )}
      <Container className={`${styles.newsDetails} my-5`}>
        <Row className="d-flex justify-content-center">
          <Col xs={12} lg={8}>
            <h1 className="pt-3 mb-5">{title}</h1>
            <p className="fw-bold">{description}</p>
            <div
              dangerouslySetInnerHTML={{ __html: image }}
              className="mb-4"
            ></div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="fw-bold">
                <p>{author}</p>
                <p className="mb-0">{formattedDate}</p>
              </div>
              <Button
                onClick={() => {
                  handleAddToFavorites({
                    id: newsId,
                    thumbnail,
                    title,
                    description,
                    hasCloseButton: true,
                  });
                }}
              >
                Adaugă la favorite
              </Button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default NewsDetails;
