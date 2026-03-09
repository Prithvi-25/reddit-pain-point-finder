import { useState, useEffect } from 'react'
import { supabase, isDemoMode } from '../lib/supabase'
import { MOCK_PAIN_POINTS } from '../data/mockData'

export function usePainPoints() {
    const [painPoints, setPainPoints] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPainPoints = async () => {
        try {
            setLoading(true)
            setError(null)

            if (isDemoMode) {
                // Simulate network delay for realism
                await new Promise(resolve => setTimeout(resolve, 600))
                setPainPoints(MOCK_PAIN_POINTS)
            } else {
                const { data, error: dbError } = await supabase
                    .from('pain_points')
                    .select('*')
                    .order('trending_score', { ascending: false })

                if (dbError) throw dbError
                setPainPoints(data || [])
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPainPoints()
    }, [])

    return { painPoints, loading, error, refetch: fetchPainPoints }
}
