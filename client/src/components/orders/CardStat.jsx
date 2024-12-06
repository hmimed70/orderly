import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const CardStat = ({statut,currency, statutText, statutColor, onClick}) => {
  const { t } = useTranslation();
    return (
        <div onClick={onClick} className="card text-white p-4 rounded-md shadow-md" style={{ backgroundColor: statutColor }}>
        <h3 className="text-lg font-bold">{statutText} </h3>
        <p className="text-2xl">{statut} {currency && t('currency')}</p>
      </div>
    )
}

CardStat.propTypes = {
    statut: PropTypes.number.isRequired,
    statutText: PropTypes.string.isRequired,
    statutColor: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    currency: PropTypes.string
  };

  export default CardStat;