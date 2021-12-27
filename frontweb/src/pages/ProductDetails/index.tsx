import './styles.css';
import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
import ProductPrice from 'components/ProductPrice';
const ProductDetails = () => {
  return (
    <div className="product-details-container">
      <div className="base-card product-details-card">
        <div className="goback-container">
          <ArrowIcon />
          <h2>Voltar</h2>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="img-container">
              <img
                src="https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/2-big.jpg"
                alt="Nome do produto"
              />
            </div>
            <div className="name-price-container">
              <h1>Nome do produto</h1>
              <ProductPrice price={123.45} />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="description-container">
              <h2>Descrição do produto</h2>
              <p>
                Seja um mestre em multitarefas com a capacidade para exibir
                quatro aplicativos simultâneos na tela. A tela está ficando
                abarrotada? Crie áreas de trabalho virtuais para obter mais
                espaço e trabalhar com os itens que você deseja. Além disso,
                todas as notificações e principais configurações são reunidas em
                uma única tela de fácil acesso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
