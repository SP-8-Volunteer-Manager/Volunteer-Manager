

function Footer(){
    return (
        <div className="container-fluid mx-0 pt-1 mb-0 py-1" style={{backgroundColor: '#bdd9f9'}}>
            <footer className="py-3 my-4">
            <p className="text-center">Homeward Bound Pet Rescue  </p>
            
                <ul className="nav justify-content-center pb-3 mb-3">
                    <li className="px-2">PO Box 792</li>
                    <li className="px-2 border-start border-dark">Ellijay GA</li>
                    <li className="px-2 border-start border-dark">30540</li>
                    <li className="px-2 border-start border-dark">706-698-4663</li>
                
                </ul>
            
            <p className="text-center text-body-secondary">© 2024 Homeward Bound Pet Rescue, Inc.</p>
            </footer>
        </div>
    );
};

export default Footer;