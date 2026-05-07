import React from 'react';
import './ErrorMessage.css';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorMessage = ({ message, onClose }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="error-toast"
                >
                    <lord-icon
                        src="https://cdn.lordicon.com/keioauhl.json"
                        trigger="loop"
                        colors="primary:#ffffff"
                        style={{width:'24px',height:'24px'}}
                    />
                    <span>{message}</span>
                    <button onClick={onClose}>&times;</button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ErrorMessage;
