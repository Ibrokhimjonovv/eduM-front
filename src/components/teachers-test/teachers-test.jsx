import React from 'react';
import "./teachers-test.scss";
import { Link } from 'react-router-dom';

const TeachersTest = () => {
    return (
        <div className='t-tests'>
            <h1>O'qituvchilar uchun toifa imtihonlari</h1>
            <p>O'qituvchilar uchun toifa imtihonlari
                <Link to="/toifa-imtihonlari">Barchasini ko'rish</Link>
            </p>
            <div className="t-tests-inner">
                <div class="tbrow subjects-block">

                    <div class="cell">
                        <ul class="subjects-list sl-3">
                            <li class="subject-10">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-10"></i>Tarix                                </a>
                                </div>
                            </li>
                            <li class="subject-11 col-1">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-11"></i>Geografiya</a>
                                </div>
                            </li>
                            <li class="subject-6 col-1">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-6"></i>Kimyo                                </a>
                                </div>
                            </li>
                            <li class="subject-12">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-12"></i>Biologiya</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="cell">
                        <ul class="subjects-list sl-2">
                            <li class="subject-4">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-4"></i>Fizika                                </a>
                                </div>
                            </li>
                            <li class="subject-5">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-5"></i>Informatika</a>
                                </div>
                            </li>
                            
                            <li class="subject-7 col-2">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-7"></i>Rus tili</a>
                                </div>
                            </li>
                            <li class="subject-8">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-8"></i>Nemis tili</a>
                                </div>
                            </li>
                            <li class="subject-9">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-9"></i>Fransuz tili</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="cell">
                        <ul class="subjects-list">
                            <li class="subject-1">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-1"></i>Matematika                                </a>
                                </div>
                            </li>
                            <li class="subject-2">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-2"></i>O‘zbek tili va adabiyoti</a>
                                </div>
                            </li>
                            <li class="subject-3">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-3"></i>Ingliz tili</a>
                                </div>
                            </li>
                            <li class="subject-12">
                                <div class="tbl">
                                    <a href="/toifa-imtihonlari"><i class="ic ic-1"></i>Matematika                                </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeachersTest