import dogImage from './assets/woman-with-dog.jpg'
import LogIn from './Components/LogIn'

function LoginPage() {
    return (
        <div className="container col-xl-10 col-xxl-8 px-1">
            <div className="row align-items-center g-lg-5 py-0">
                <div className="col-lg-6 text-center text-lg-start px-lg-5">
                    <h1 className="h3 mb-3 fw-normal">Please log in</h1>
                        <LogIn />
                
                </div>


                <div className="col-lg-6 d-none d-md-block my-4">
                    <img src={dogImage} className="img-fluid w-100 h-100  rounded-15" alt="woman and dog" loading="lazy" />
                </div>
            </div>
        </div>
    
    );
};


export default LoginPage;
