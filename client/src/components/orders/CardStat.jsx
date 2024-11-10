import PropTypes from 'prop-types';

const CardStat = ({statut, statutText, statutColor}) => {
    return (
        <div className="card text-white p-4 rounded-md shadow-md" style={{ backgroundColor: statutColor }}>
        <h3 className="text-lg font-bold">{statutText}</h3>
        <p className="text-2xl">{statut}</p>
      </div>
    )
}

CardStat.propTypes = {
    statut: PropTypes.number.isRequired,
    statutText: PropTypes.string.isRequired,
    statutColor: PropTypes.string.isRequired
  };

  export default CardStat;