

function Footer(){
    return (
        <div className="container-fluid mt-5 py-3 mb-0" style={{backgroundColor: '#bdd9f9'}}>
            <footer className="py-0">
                <p className="text-center">Homeward Bound Pet Rescue  </p>
                
                    <ul className="nav justify-content-center pb-3">
                        <li className="px-2">PO Box 792</li>
                        <li className="px-2 border-start border-dark">Ellijay GA</li>
                        <li className="px-2 border-start border-dark">30540</li>
                        <li className="px-2 border-start border-dark">706-698-4663</li>
                    
                    </ul>
                
                <p className="text-center text-body-secondary mb-0">© 2024 Homeward Bound Pet Rescue, Inc.</p>
            </footer>
        </div>
    );
};

export default Footer;