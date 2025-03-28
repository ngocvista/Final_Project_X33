import React from 'react';
import { ContactItemsData } from './ContactItemsData';

const ContactItems: React.FC = () => {
    return (
        <section id="contact-items">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="title text-center">
                            <h2>Liên hệ với chúng tôi</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        ContactItemsData.map((item) => (
                            <div key={item.id} className="col-lg-4 col-md-4 col-sm-6">
                                <div className="contact-item">
                                    <div className="icon d-flex justify-content-center">
                                        <h5>{item.title}</h5>
                                    </div>
                                    <div className="content text-center">
                                        <p className="paragraph">{item.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
};

export default ContactItems;