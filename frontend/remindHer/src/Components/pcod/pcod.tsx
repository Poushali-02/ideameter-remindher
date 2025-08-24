import React, { useState } from "react";
import { pcod_prediction } from '../services/geminiService';
import ReactMarkdown from "react-markdown";
import { Link } from 'react-router-dom';


interface FormInput {
    age: number;
    weight: number;
    height: number;
    symptoms: string[];
}

interface Error {
    age?: string;
    weight?: string;
    height?: string;
    symptoms?: string;
}

const PcodForm: React.FC = () => {
    const [formData, setFormData] = useState<FormInput>({
        age: 0,
        weight: 0,
        height: 0,
        symptoms: []
    });
    
    const [errors, setErrors] = useState<Error>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSymptomSelection, setShowSymptomSelection] = useState(true);
    const [symptomsFinalized, setSymptomsFinalized] = useState(false);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [showPrediction, setShowPrediction] = useState(false);
    const [isGettingPrediction, setIsGettingPrediction] = useState(false);

    const symptomOptions = [
        'Irregular periods', 'Heavy bleeding', 'Missed periods', 'Weight gain',
        'Hair loss', 'Excessive hair growth', 'Acne', 'Mood changes',
        'Fatigue', 'Sleep problems', 'Difficulty getting pregnant', 'Insulin resistance'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name as keyof Error]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSymptomChange = (symptom: string) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
        
        if (errors.symptoms) {
            setErrors(prev => ({
                ...prev,
                symptoms: undefined
            }));
        }
    };

    const handleFinalizeSymptoms = () => {
        if (formData.symptoms.length === 0) {
            setErrors(prev => ({
                ...prev,
                symptoms: 'Please select at least one symptom before finalizing'
            }));
            return;
        }
        setShowSymptomSelection(false);
        setSymptomsFinalized(true);
        if (errors.symptoms) {
            setErrors(prev => ({
                ...prev,
                symptoms: undefined
            }));
        }
    };

    const handleAddMoreSymptoms = () => {
        setShowSymptomSelection(true);
        setSymptomsFinalized(false);
    };

    const validateForm = (): boolean => {
        const newErrors: Error = {};

        if (formData.symptoms.length === 0) {
            newErrors.symptoms = 'Please select at least one symptom';
        }

        if (!formData.weight) {
            newErrors.weight = 'Weight is required';
        } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
            newErrors.weight = 'Please enter a valid weight';
        }

        if (!formData.height) {
            newErrors.height = 'Height is required';
        } else if (isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
            newErrors.height = 'Please enter a valid height';
        }

        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
            newErrors.age = 'Please enter a valid age (1-120)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setIsGettingPrediction(true);

        try {
            console.log('Form submitted:', formData);
            
            const predictionResult = await pcod_prediction(formData);

            if (predictionResult.success) {
                setPrediction(predictionResult.prediction ?? "No prediction available for now");
                setShowPrediction(true);
            } else {
                alert('Failed to get AI analysis: ' + predictionResult.error);
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
            setIsGettingPrediction(false);
        }
    };

    const handleCheckAgain = () => {
        setShowPrediction(false);
        setPrediction(null);
        setFormData({
            symptoms: [],
            weight: 0,
            height: 0,
            age: 0
        });
        setSymptomsFinalized(false);
        setShowSymptomSelection(true);
        setErrors({});
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-2xl animate-fadein">
            {!showPrediction ? (
                /* FORM VIEW */
                <>
                    <h2 className="text-3xl font-extrabold text-pink-700 mb-8 text-center tracking-tight drop-shadow-md">
                        PCOD Health Assessment
                    </h2>                    
                    <Link 
                      to="/" 
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Go Back
                    </Link>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Symptoms Section */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                Symptoms <span className="text-red-500">*</span>
                            </label>

                            {showSymptomSelection && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {symptomOptions.map((symptom) => (
                                            <label key={symptom} className="flex items-center bg-pink-50 rounded-lg px-3 py-2 shadow-sm hover:bg-pink-100 transition cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id={symptom}
                                                    checked={formData.symptoms.includes(symptom)}
                                                    onChange={() => handleSymptomChange(symptom)}
                                                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                                                />
                                                <span className="ml-2 text-sm font-medium text-gray-700">{symptom}</span>
                                            </label>
                                        ))}
                                    </div>
                                    
                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="button"
                                            onClick={handleFinalizeSymptoms}
                                            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                        >
                                            Finalize Symptoms
                                        </button>
                                    </div>
                                </div>
                            )}

                            {symptomsFinalized && (
                                <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-pink-700">
                                            Selected Symptoms ({formData.symptoms.length})
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={handleAddMoreSymptoms}
                                            className="px-4 py-2 bg-white border-2 border-pink-400 text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            Add Other Symptom
                                        </button>
                                    </div>
                                    
                                    {formData.symptoms.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {formData.symptoms.map((symptom) => (
                                                <div key={symptom} className="flex items-center bg-white border border-pink-300 rounded-full px-4 py-2 shadow-sm">
                                                    <span className="text-sm font-medium text-pink-800">
                                                        {symptom}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSymptomChange(symptom)}
                                                        className="ml-2 text-pink-500 hover:text-pink-700 transition-colors"
                                                        title="Remove symptom"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-pink-600 italic">No symptoms selected</p>
                                    )}
                                    
                                    <div className="mt-4 pt-4 border-t border-pink-200">
                                        <p className="text-sm text-pink-600">
                                            ✅ Symptoms review completed • 
                                            <span className="font-semibold"> {formData.symptoms.length} symptoms</span> selected
                                        </p>
                                    </div>
                                </div>
                            )}

                            {errors.symptoms && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.symptoms}
                                </p>
                            )}
                        </div>

                        {/* Weight Input */}
                        <div>
                            <label htmlFor="weight" className="block text-lg font-semibold text-gray-700 mb-2">
                                Weight (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight || ''}
                                onChange={handleInputChange}
                                placeholder="Enter your weight"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-pink-50 placeholder-gray-400 ${
                                    errors.weight ? 'border-red-500' : 'border-gray-300'
                                }`}
                                min="1"
                                step="0.1"
                            />
                            {errors.weight && (
                                <p className="mt-2 text-sm text-red-600">{errors.weight}</p>
                            )}
                        </div>

                        {/* Height Input */}
                        <div>
                            <label htmlFor="height" className="block text-lg font-semibold text-gray-700 mb-2">
                                Height (cm) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height || ''}
                                onChange={handleInputChange}
                                placeholder="Enter your height"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-pink-50 placeholder-gray-400 ${
                                    errors.height ? 'border-red-500' : 'border-gray-300'
                                }`}
                                min="1"
                                step="0.1"
                            />
                            {errors.height && (
                                <p className="mt-2 text-sm text-red-600">{errors.height}</p>
                            )}
                        </div>

                        {/* Age Input */}
                        <div>
                            <label htmlFor="age" className="block text-lg font-semibold text-gray-700 mb-2">
                                Age (years) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age || ''}
                                onChange={handleInputChange}
                                placeholder="Enter your age"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-pink-50 placeholder-gray-400 ${
                                    errors.age ? 'border-red-500' : 'border-gray-300'
                                }`}
                                min="1"
                                max="120"
                            />
                            {errors.age && (
                                <p className="mt-2 text-sm text-red-600">{errors.age}</p>
                            )}
                        </div>

                        {/* Submit Button - Only show when symptoms are finalized */}
                        {symptomsFinalized && (
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isGettingPrediction}
                                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                                        isSubmitting || isGettingPrediction
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-pink-500 to-purple-400 hover:from-pink-600 hover:to-purple-500 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {isGettingPrediction ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Getting AI Analysis...
                                        </div>
                                    ) : isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        'Get AI Health Analysis'
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </>
            ) : (
                /* PREDICTION RESULTS VIEW */
                <div className="space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-extrabold text-pink-700 mb-2 tracking-tight drop-shadow-md">
                            🩺 Your Health Analysis Results
                        </h2>
                        <p className="text-gray-600 text-lg">AI-powered insights based on your health data</p>
                    </div>

                    {/* Prediction Display with Markdown Rendering */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 shadow-lg">
                        <div className="prose prose-lg max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-2xl font-bold text-purple-700 mb-4 border-b-2 border-purple-200 pb-2">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-xl font-semibold text-pink-700 mb-3 mt-6">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-lg font-medium text-purple-600 mb-2 mt-4">
                                            {children}
                                        </h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="mb-4 text-gray-700 leading-relaxed">
                                            {children}
                                        </p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="mb-1">
                                            {children}
                                        </li>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-semibold text-purple-800">
                                            {children}
                                        </strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic text-pink-700">
                                            {children}
                                        </em>
                                    )
                                }}
                            >
                                {prediction || 'No prediction available'}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Summary of Input Data */}
                    <div className="bg-white border-2 border-pink-200 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-pink-700 mb-4">
                            📋 Analysis Based On:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p><strong>Age:</strong> {formData.age} years</p>
                                <p><strong>Weight:</strong> {formData.weight} kg</p>
                                <p><strong>Height:</strong> {formData.height} cm</p>
                                <p><strong>BMI:</strong> {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}</p>
                            </div>
                            <div>
                                <p className="mb-2"><strong>Symptoms ({formData.symptoms.length}):</strong></p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.symptoms.map((symptom) => (
                                        <span
                                            key={symptom}
                                            className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                                        >
                                            {symptom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={handleCheckAgain}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            📝 Check Again
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex-1 py-3 px-6 bg-white border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-md"
                        >
                            🖨️ Print Results
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for medical concerns.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PcodForm;
