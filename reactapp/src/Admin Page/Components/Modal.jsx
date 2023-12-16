import Button2 from '../../Main Page/Components/Button';

const Modal = ({ name, name2, name3, isVisible, toggleModal, loading, func }) => {
    return (
        <div className="modalBg" style={{ display: isVisible ? 'block' : 'none' }}>
            <div className="modal">
                <p style={{ color: 'black', fontFamily: 'SF-Pro-Display-Regular', fontSize: '20px' }}>Are you sure you want to delete the {name3}<span style={{ fontFamily: 'SF-Pro-Display-Bold', color: 'black' }}>{name}</span> {name2} ?</p>
                <div style={{ display: 'flex', width: 'fit-content', height: 'fit-content' }}>
                    <Button2 text={'No'} onclick={toggleModal} background={'white'} textColor={'black'} margin={'20px 10px 20px 0'} />
                    {loading ? (
                        <div class="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>
                    ) : (
                        <Button2 text={'Yes'} background={'black'} textColor={'white'} onclick={func} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
